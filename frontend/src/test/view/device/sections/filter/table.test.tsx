import React, { type ReactNode } from "react"

import { MockedProvider } from "@apollo/client/testing"

import { DataGridProps } from "@mui/x-data-grid"
import userEvent from "@testing-library/user-event"

import { type EnhancedStore } from "@reduxjs/toolkit"

import '@testing-library/jest-dom'
import { fireEvent, screen, render, waitFor, type RenderResult } from "@testing-library/react"

import { SnackbarProvider, useSnackbar } from "notistack"
import { Provider, useDispatch } from "react-redux"

import { type AppDispatch } from "../../../../../main/app/controller/store"

import Device from "../../../../../main/app/model/device/device"
import Filter from "../../../../../main/app/model/filters/Filter"
import { SnapshotData } from "../../../../../main/app/model/snapshot/snapshotData"

import FilterTable from "../../../../../main/app/view/pages/computer/sections/filters/table"

import { type ApolloMockResult, renderWithProvideers as renderWithProviders, initApolloMock, initInitialState, initUseSelectorMock } from "../../../utils"
import MockedDataGrid from "../../../../mocks/x-data-grid/mockedDataGrid"
import { filterSlice } from "../../../../../main/app/controller/deviceMainInfos/filterSlice"
import ValidationError from "../../../../../main/app/model/exception/errors/validationError"

jest.mock("@mui/x-data-grid", () => {
    const originalModule = jest.requireActual("@mui/x-data-grid")
    return {
        ...originalModule,
        DataGrid: ({ rows, columns, onRowSelectionModelChange, ...props }: DataGridProps & { apiRef: React.RefObject<any> }) => {
            const slots = props.slots;
            slots?.toolbar

            return <MockedDataGrid
                columns={columns}
                rows={rows}
                toolbar={slots?.toolbar as ReactNode}
            />
        }
    }
})

jest.mock('@mui/material/Tooltip', () => {
    return async ({ children }: { children: ReactNode }) => await children;
});

jest.mock('@mui/material/transitions', () => ({
    ...jest.requireActual('@mui/material/transitions'),
    useTransitionProps: () => ({ timeout: 0 })
}));

jest.mock("notistack", () => {
    const actual = jest.requireActual("notistack");
    return {
        ...actual,
        useSnackbar: jest.fn()
    };
});

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe("Device main infos Filter table render (no filter)", () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    /**
     * Mock ``enqueueSnackbar`` function
     * @returns {jest.Mock} Mocked ``enqueueSnackbar`` function
     */
    const initEnqueueSnackbarMock = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        return mockEnqueueSnackbar
    }

    /**
     * Render the SoftwaresOrigin component with the Apollo query and store mocks
     * @param {EnhancedStore} store Redux mocked store
     * @param {ApolloMockResult[]} apolloMocks Apollo GraphQL queries result mock
     * @returns {RenderResult} Mocked table for unit test rendered
     */
    const renderMockedComponent = (store: EnhancedStore, apolloMocks: Map<string, ApolloMockResult>): RenderResult => {
        return render(
            <Provider store={store}>
                <div style={{ height: 400, width: '100%' }}>
                    <MockedProvider
                        mocks={Array.from(apolloMocks.values())}>
                        <FilterTable />
                    </MockedProvider>
                </div>
            </Provider>
        )
    }

    test("Pending data render", async () => {
        // Before
        initApolloMock("loadingDevice")
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("loadingSnapshot")
        const store = renderWithProviders(initialState)

        initUseSelectorMock(store.getState())
        const apolloMocks = initApolloMock("loadingSnapshot")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render", async () => {
        // Before
        const device = new Device();
        const snapshot = new SnapshotData();

        initApolloMock("success")
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device)
        const store = renderWithProviders(initialState)

        initUseSelectorMock(store.getState())
        const apolloMocks = initApolloMock("success", undefined, device)

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Unsuccessful render", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("snapshotError")
        const store = renderWithProviders(initialState)
        initUseSelectorMock(store.getState())

        // Acts
        const apolloMocks = initApolloMock("snapshotError")
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Row selected : footer displayed", async () => {
        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")
        const filters = [
            new Filter(
                "File",
                "name",
                "<",
                "apt" as any as object,
                0
            )
        ]
        initEnqueueSnackbarMock()

        const initialState = initInitialState(
            "success",
            ["device", "snapshot", "filter"],
            snapshot,
            new Device(),
            filters
        )
        const store = renderWithProviders(initialState)
        initUseSelectorMock(store.getState())

        const apolloMocks = initApolloMock("success", snapshot, new Device())

        // Acts
        const { container, rerender } = renderMockedComponent(store, apolloMocks)
        const rowFileCell = container.querySelector(".MuiDataGrid-row")

        if (rowFileCell === null) {
            throw new Error("No row : test fail!")
        }

        fireEvent.click(rowFileCell)

        store.getState().filter.selectedFilteredIDS = [0]

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={Array.from(apolloMocks.values())} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        await waitFor(() => {
            expect(screen.getByText("Delete filters")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test("New filter button should render form successfully", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)
        initUseSelectorMock(initialState)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn(()=>{throw new ValidationError("")});

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: "New filter" }) as Element
        fireEvent.click(newFilterButton)

        // Asserts
        await waitFor(() => {
            const selectedElement = screen.getByText("File")
            let newFilterDialogRootNode = selectedElement?.parentElement
            while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
                newFilterDialogRootNode = newFilterDialogRootNode.parentElement
            }
            expect(newFilterDialogRootNode).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test("When the user changes the type of filter, the input type should be updated", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2000-01-01'))

        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)
        initUseSelectorMock(initialState)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const fieldNameSelect = (
            (newFilterDialogRootNode as HTMLElement).children[1] as HTMLSelectElement
        )
        expect(fieldNameSelect).toBeInTheDocument()
        await userEvent.selectOptions(fieldNameSelect, "creationDate")

        const fieldInput = (container.querySelector('[data-testid="datePicker"]') as HTMLInputElement) as HTMLDivElement

        // Asserts
        expect(fieldInput).toBeInTheDocument()
        expect(fieldInput.getAttribute("placeholder")).toBe("MM/DD/YYYY")
        expect(fieldInput.getAttribute("value")).toBe("2000-01-01")
    })

    test("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)
        initUseSelectorMock(initialState)

        const enqueueSnackbarMock = initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const addFilterButton = newFilterDialogRootNode?.childNodes.item(4)
        fireEvent.click(addFilterButton as ChildNode)

        // Asserts
        expect(enqueueSnackbarMock).toHaveBeenCalled()
    })

    test("Trying to add new filter without setting value should trigger a notification display",
        async () => {
            // Given
            const snapshot = new SnapshotData()
            const filters: Filter[] = []
            snapshot.addSoftware("test", "test software", "1.0")

            const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
            const store = renderWithProviders(initialState)
            initUseSelectorMock(initialState)
            initEnqueueSnackbarMock()

            const mockedDispatch: AppDispatch = jest.fn();

            (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

            const apolloMocks = initApolloMock("success", snapshot)
            const { container } = renderMockedComponent(store, apolloMocks)

            // Acts
            const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
            fireEvent.click(newFilterButton)

            const selectedElement = screen.getByText("File")
            let newFilterDialogRootNode = selectedElement?.parentElement
            while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
                newFilterDialogRootNode = newFilterDialogRootNode.parentElement
            }

            const addFilterButton = newFilterDialogRootNode?.childNodes.item(4)

            fireEvent.keyDown(addFilterButton as ChildNode, {
                key: "Enter",
                code: "Enter"
            })

            // Asserts
            const newFilterForm = container.querySelector(".newElementDialog")
            expect(newFilterForm).toBeInTheDocument()
            expect(useSnackbar).toHaveBeenCalled()
        })

    /*test("Pressing tab key should focus other element", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)
        initUseSelectorMock(initialState)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const elementTypeSelect = newFilterDialogRootNode?.childNodes.item(0) as HTMLElement;
        const fieldNameSelect = newFilterDialogRootNode?.childNodes.item(1) as HTMLElement;
        const comparisonSelect = newFilterDialogRootNode?.childNodes.item(2) as HTMLElement;
        const fieldValueInput = newFilterDialogRootNode?.childNodes.item(3) as HTMLElement;

        fireEvent.keyDown(fieldValueInput, {
            key: "Tab",
            code: "Tab"
        })

        // Asserts
        expect(fieldValueInput).not.toHaveFocus()
        expect(fieldNameSelect).not.toHaveFocus()
        expect(comparisonSelect).not.toHaveFocus()
        expect(elementTypeSelect).toHaveFocus()
    })*/


    test("Adding element (no filter yet added!) and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initUseSelectorMock(initialState)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[data-testid="deviceMainInfosFilterValueField"]') as HTMLInputElement
        const newElementDialog = container.querySelector(".newElementDialog")

        await userEvent.type(fieldValueInput, "Test value")

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        store.getState().filter.filters.push(new Filter(
            "File",
            "name",
            "<",
            "Test value" as unknown as object,
            1
        ))

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={Array.from(apolloMocks.values())}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        expect(newElementDialog).not.toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText("Test value")).toBeInTheDocument()
        }, { timeout: 2500 })
    })


    test("Entering value and emptying it should display toast notification (empty value)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initUseSelectorMock(initialState)
        const mockedSnackbar = initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[data-testid="deviceMainInfosFilterValueField"]') as HTMLInputElement

        await userEvent.type(fieldValueInput, "t")

        expect(fieldValueInput).toHaveValue("t")

        await userEvent.clear(fieldValueInput)

        // Asserts
        expect(fieldValueInput).toBeInTheDocument()
        expect(mockedSnackbar).toHaveBeenCalledWith("You must enter a value here!", { variant: "error" })
    })

    test("Adding two identical filter and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter(
                "File",
                "name",
                "<",
                "Test value!" as unknown as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initUseSelectorMock(initialState)
        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        await userEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[data-testid="deviceMainInfosFilterValueField"]') as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value!" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        store.dispatch({
            type: "filter/addFilter",
            payload: JSON.parse(JSON.stringify(
                new Filter(
                    "File",
                    "name",
                    "<",
                    "Test value!" as unknown as object,
                    2
                )
            ))
        })

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={Array.from(apolloMocks.values())}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        expect(fieldValueInput).not.toBeInTheDocument()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("The filter is already set! It will be ignored!", { variant: "warning" })

    })

    /*
    test("Adding two filters with same ID", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter(
                "File",
                "name",
                "<",
                "Test value!" as unknown as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value!" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })
        store.dispatch({
            type: "filter/addFilter",
            payload: JSON.parse(JSON.stringify(
                new Filter(
                    "File",
                    "name",
                    "<",
                    "Test value!" as unknown as object,
                    1
                )
            ))
        })

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        expect(fieldValueInput).not.toBeInTheDocument()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Another filter has this id!", { variant: "warning" })

    })

    test("Adding filter with invalid element type", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value!" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })
        store.dispatch({
            type: "filter/addFilter",
            payload: JSON.parse(JSON.stringify(
                new Filter(
                    "file" as any,
                    "name",
                    "<",
                    "Test value!" as unknown as object,
                    1
                )
            ))
        })

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        expect(fieldValueInput).not.toBeInTheDocument()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("The input type file set is not valid. The only ones accepted are : \"File\" or \"Library\".", { variant: "error" })
    })

    test("Adding filter with invalid comparison operator", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value!" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })
        store.dispatch({
            type: "filter/addFilter",
            payload: JSON.parse(JSON.stringify(
                new Filter(
                    "File",
                    "name",
                    "<>" as any,
                    "Test value!" as unknown as object,
                    1
                )
            ))
        })

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        expect(fieldValueInput).not.toBeInTheDocument()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("The comparison <> set is not valid. The only ones accepted are : \"<\", \"<=\", \">\", \">=\", \"≠\", \"==\" or \"includes\".", { variant: "error" })
    })

    test("Adding two filters and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter(
                "File",
                "name",
                "<",
                "Test value!" as unknown as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        let fieldValueInput;
        for (let i = 0; i <= 1; i++) {
            const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
            fireEvent.click(newFilterButton)
            fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

            fireEvent.change(fieldValueInput, { target: { value: `Test value${i}` } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })

            store.dispatch({
                type: "filter/addFilter",
                payload: JSON.parse(
                    JSON.stringify(
                        new Filter(
                            "File",
                            "name",
                            "<",
                            `Test value${i}` as unknown as object,
                            i
                        )
                    )
                )
            })

            rerender(
                <Provider store={store}>
                    <MockedProvider mocks={apolloMocks} addTypename={false}>
                        <SnackbarProvider>
                            <FilterTable />
                        </SnackbarProvider>
                    </MockedProvider>
                </Provider>
            )
        }

        // Asserts
        const rows = ((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).querySelector(".MuiDataGrid-row")
        await waitFor(() => {
            expect(rows).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test("Selecting two added filters", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters = [
            new Filter(
                "File",
                "name",
                "<",
                "test0" as any as object,
                0
            ),
            new Filter(
                "File",
                "name",
                "<",
                "test1" as any as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        let fieldValueInput;
        for (let i = 0; i <= 1; i++) {
            const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
            fireEvent.click(newFilterButton)

            fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

            fireEvent.change(fieldValueInput, { target: { value: `Test value${i}` } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
        }
        store.dispatch({
            type: "filter/updateSelectedFilter",
            payload: [0, 1]
        })

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        const checkbox = (((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).parentNode as ParentNode).querySelector(".MuiDataGrid-columnHeaderCheckbox")?.querySelector("input") as HTMLInputElement
        fireEvent.click(checkbox)

        // Asserts
        await waitFor(() => {
            expect((screen.getByText("2 filtres sélectionnés!").parentNode as ParentNode).querySelector("p")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test("Delete one filter from three previously added", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters = [
            new Filter(
                "File",
                "name",
                "<",
                "test0" as any as object,
                0
            ),
            new Filter(
                "File",
                "name",
                "<",
                "test1" as any as object,
                1
            ),
            new Filter(
                "File",
                "name",
                "<",
                "test2" as any as object,
                2
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const rowCheckbox = (screen.getByText(`test0`).parentNode as ParentNode).querySelector("input") as HTMLInputElement
        fireEvent.click(rowCheckbox)
        store.dispatch({
            type: "filter/updateSelectedFilter",
            payload: [0]
        })

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        const filterDeleteButton = screen.getByText("Delete filters")
        fireEvent.click(filterDeleteButton)
        store.dispatch({
            type: "filter/deleteFilter",
            payload: [0]
        })

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        expect(screen.queryAllByText("File")).toHaveLength(2)
    })

    test("Selecting date in the input field name from the new filter Form", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2020-01-13'))
        jest.mock("@mui/material/Select", () => (...rest: any) => {
            <div>
                <input data-testid='mocked-select' {...rest} />
            </div>
        })

        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        const fieldNameInput = (screen.getAllByText("Field name")[0].parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValue = screen.getByText("Field value").parentElement as HTMLElement
        const inputField = fieldValue.querySelector("input") as HTMLInputElement
        const fieldValueType = fieldValue.querySelector("button") as HTMLInputElement

        fireEvent.click(fieldValueType)
        const selectedDate = screen.getByText("11")
        fireEvent.click(selectedDate)
        const updatedDate = inputField.value

        // Asserts
        expect(inputField.getAttribute("placeholder")).toBe("MM/DD/YYYY")
        await waitFor(() => {
            expect(selectedDate).not.toBeInTheDocument()
        })
        expect(updatedDate).toBe("01/11/2020")
    })

    test("Typing date directly in the input field name from the new filter Form", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))

        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
        initEnqueueSnackbarMock()

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldNameInput = (screen.getAllByText("Field name")[0].parentElement as HTMLElement).querySelector("input") as HTMLInputElement
        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValue = screen.getByText("Field value").parentElement as HTMLElement

        const inputField = fieldValue.querySelector("input") as HTMLInputElement
        userEvent.type(inputField, "01/10/2020")
        const newDate = inputField.value

        fireEvent.keyDown(newFilterButton, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(inputField.getAttribute("placeholder")).toBe("MM/DD/YYYY")
        expect(newDate).toBe("01/10/2020")
    }) */
})
