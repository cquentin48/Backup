import React, { type ReactNode } from "react"

import { type DocumentNode, type FetchResult } from "@apollo/client"
import { type ResultFunction, MockedProvider } from "@apollo/client/testing"

import { type DataGridProps } from "@mui/x-data-grid"

import { type EnhancedStore, configureStore } from "@reduxjs/toolkit"

import '@testing-library/jest-dom'
import { fireEvent, screen, render, waitFor, type RenderResult } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SnackbarProvider, useSnackbar } from "notistack"
import { Provider, useDispatch, useSelector } from "react-redux"

import snapshotReducer from "../../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"
import filterReducer from "../../../../../main/app/controller/deviceMainInfos/filterSlice"
import deviceReducer from "../../../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import { type OperationStatus, type AppDispatch, type AppState } from "../../../../../main/app/controller/store"

import Device from "../../../../../main/app/model/device/device"
import NotFoundError from "../../../../../main/app/model/exception/errors/notFoundError"
import Filter from "../../../../../main/app/model/filters/Filter"
import gqlClient from "../../../../../main/app/model/queries/client"
import { type LoadSnapshotQueryResult } from "../../../../../main/app/model/queries/computer/loadSnapshot"
import { SnapshotData } from "../../../../../main/app/model/snapshot/snapshotData"

import FilterTable from "../../../../../main/app/view/pages/computer/sections/filters/table"

import FETCH_SNAPSHOT from '../../../../../main/res/queries/snapshot.graphql';
import { ApolloMockResult, createMockStore, initApolloMock, initInitialState, initUseSelectorMock } from "../../../utils"

jest.mock("@mui/x-data-grid", () => {
    const originalModule = jest.requireActual("@mui/x-data-grid")
    return {
        ...originalModule,
        DataGrid: ({ apiRef, ...props }: DataGridProps & { apiRef: React.RefObject<any> }) => {
            apiRef.current = {};
            return <originalModule.DataGrid {...props} />
        }
    }
})

jest.mock('@mui/material/Tooltip', () => {
    return ({ children }: { children: ReactNode }) => children;
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
     * @returns {NotFoundError} If the operation is marked as a success and no snapshot is provided.
     */
    const renderMockedComponent = (store: EnhancedStore, apolloMocks: Map<string, ApolloMockResult>): RenderResult => {
        return render(
            <Provider store={store}>
                <MockedProvider mocks={Array.from(apolloMocks.values())} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
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
        const store = createMockStore(initialState)

        initUseSelectorMock(store.getState())
        const apolloMocks = initApolloMock("loadingSnapshot")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()

        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, new Device())
        const store = createMockStore(initialState)
        initUseSelectorMock(store.getState())
        const apolloMocks = initApolloMock("success", snapshot, new Device())

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
        const store = createMockStore(initialState)
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

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const initialState = initInitialState(
            "success",
            ["device", "snapshot", "filter"],
            snapshot,
            new Device(),
            filters
        )
        const store = createMockStore(initialState)
        initUseSelectorMock(store.getState())
        const apolloMocks = initApolloMock("success", snapshot, new Device())

        // Acts
        const { container, rerender } = renderMockedComponent(store, apolloMocks)
        const rowFileCell = container.querySelector(".MuiDataGrid-row")
        if (rowFileCell === null) {
            throw new Error("No row : test fail!")
        }

        fireEvent.click(rowFileCell)
        store.dispatch({
            type: "filter/updateSelectedFilter",
            payload: [0]
        })

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

    /*
    test.skip("New filter button should render form successfully", async () => {
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

        // Asserts
        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }
        expect(newFilterDialogRootNode).toBeInTheDocument()
    })

    test.skip("When the user changes the type of filter, the input type should be updated", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2000-01-01'))

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
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const fieldNameSelect = (newFilterDialogRootNode as HTMLElement).childNodes.item(1).childNodes.item(1).childNodes.item(1)
        fireEvent.change(fieldNameSelect, { target: { value: "creationDate" } })
        const fieldInput = (container.querySelector("#datePicker") as HTMLInputElement).querySelector("input") as HTMLDivElement

        // Asserts
        expect(fieldInput).toBeInTheDocument()
        expect(fieldInput.getAttribute("placeholder")).toBe("MM/DD/YYYY")
        expect(fieldInput.getAttribute("value")).toBe("01/01/2000")
    })

    test.skip("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)
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

    test.skip("Trying to add new filter without setting value should launch console.log", async () => {
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

    test.skip("Pressing tab key should focus other element", async () => {
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

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const fieldValueInput = newFilterDialogRootNode?.childNodes.item(3).childNodes.item(1).childNodes.item(0) as HTMLElement

        fireEvent.keyDown(fieldValueInput, {
            key: "Tab",
            code: "Tab"
        })

        // Asserts
        expect(fieldValueInput).toHaveFocus()
    })

    test.skip("Adding element (no filter yet added!) and pressing enter key", async () => {
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
        const { rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value" } })

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
                    "Test value" as unknown as object,
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
        await waitFor(() => {
            expect(screen.getByText("Test value")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test.skip("Entering value and emptying it should display toast notification (empty value)", async () => {
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

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value" } })
        fireEvent.change(fieldValueInput, { target: { value: "" } })

        // Asserts
        expect(fieldValueInput).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText("You must enter a value here!")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test.skip("Adding two identical filter and pressing enter key", async () => {
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
                    2
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
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("The filter is already set! It will be ignored!", { variant: "warning" })

    })

    test.skip("Adding two filters with same ID", async () => {
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

    test.skip("Adding filter with invalid element type", async () => {
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

    test.skip("Adding filter with invalid comparison operator", async () => {
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

    test.skip("Adding two filters and pressing enter key", async () => {
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

    test.skip("Selecting two added filters", async () => {
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

    test.skip("Delete one filter from three previously added", async () => {
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

    test.skip("Selecting date in the input field name from the new filter Form", async () => {
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

    test.skip("Typing date directly in the input field name from the new filter Form", async () => {
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
    })*/
})
