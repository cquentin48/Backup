import React, { ChangeEventHandler } from "react"

import { MockedProvider } from "@apollo/client/testing"

import { type DataGridProps } from "@mui/x-data-grid"
import userEvent from "@testing-library/user-event"

import { type EnhancedStore } from "@reduxjs/toolkit"

import '@testing-library/jest-dom'
import { fireEvent, screen, render, waitFor, type RenderResult } from "@testing-library/react"

import { SnackbarProvider, useSnackbar } from "notistack"
import { Provider, useDispatch } from "react-redux"

import { AppState, type AppDispatch } from "../../../../../main/app/controller/store"

import Device from "../../../../../main/app/model/device/device"
import Filter from "../../../../../main/app/model/filters/Filter"
import { SnapshotData } from "../../../../../main/app/model/snapshot/snapshotData"

import FilterTable from "../../../../../main/app/view/pages/computer/sections/filters/table"

import { type ApolloMockResult, renderWithProvideers as renderWithProviders, initApolloMock, initInitialState } from "../../../utils/utils"
import MockedDataGrid from "../../../../mocks/x-data-grid/mockedDataGrid"

import { DateUtils } from "../../../utils/date"

jest.mock('@mui/material/Tooltip', () => {
    return ({ children }: { children: object }) => (
        <div className={
            children["props"]["className"]
        }
            onClick={children["props"]["onClick"]}
        >
            {children["props"]["children"]}
        </div>
    )
});

jest.mock("@mui/material/Select", () => {
    return ({ id, labelID, label, onChange, children, inputRef, ref }:
        { id: string, labelID: string, label: string, onChange: ChangeEventHandler, children: Array<React.ReactNode>, inputRef: (ref: never) => void, ref: any }) => (
        <div>
            <div id={labelID}>{label}</div>
            <select
                onChange={onChange}
                id={id}
                ref={ref ?? inputRef}
            >
                {
                    children.map((input) => input)
                }
            </select>
        </div>
    )
});

jest.mock("@mui/material/MenuItem", () => {
    return ({ value, children }: { value: string, children: string }) => (
        <option value={value}>
            {children}
        </option>
    )
});

jest.mock("@mui/x-data-grid", () => {
    return {
        ...jest.requireActual("@mui/x-data-grid"),
        GridToolbarContainer: ({ children }: { children: React.ReactNode }) => {
            return (<div data-testid="toolbar-container">{children}</div>)
        },
        GridToolbarColumnsButton: () => (
            <div>
                Colonnes
            </div>
        ),
        GridToolbarFilterButton: () => (
            <div>
                Filtres
            </div>
        ),
        GridToolbarDensitySelector: () => (
            <div>
                Densité
            </div>
        ),
        GridToolbarExport: () => (
            <div>
                Exporter
            </div>
        ),
        DataGrid: ({ rows, columns, ...props }: DataGridProps & { apiRef: React.RefObject<any> }) => {
            const mockCallbacks: Record<string, any> = {};
            Object.assign(mockCallbacks, props);
            return <MockedDataGrid
                columns={columns}
                rows={rows}
                checkboxSelection={
                    props.checkboxSelection !== null ? props.checkboxSelection! : false
                }
                toolbar={props.slots?.toolbar}
                footer={props.slots?.footer}
                slotsProps={props.slotProps}
                updateSelectedRows={mockCallbacks["onRowSelectionModelChange"]}
            />
        }
    }
});

jest.mock('@mui/material/TextField', () => {
    return (
        {
            id, onChange, label, autoFocus, type, ref, inputRef, helperText, ...props
        }:
            {
                id: string, onChange: ChangeEventHandler,
                label: string, autoFocus?: boolean, type: string,
                ref: any, inputRef: (ref: never) => void, helperText: boolean|string
            }) => (
        <div>
            <div id={`${id}-label`}>
                {label}
            </div>
            <input
                autoFocus={autoFocus !== undefined ? autoFocus : false}
                type={type}
                id={id}
                onChange={onChange}
                ref={ref ?? inputRef}
            />{
                helperText ?? <div id={`${id}helper`}>{helperText}</div>
            }
        </div>
    )
})

jest.mock('@mui/material/transitions', () => ({
    ...jest.requireActual('@mui/material/transitions'),
    useTransitionProps: () => ({ timeout: 0 })
}));

jest.mock("@mui/x-date-pickers", () => {
    return {
        ...jest.requireActual("@mui/x-date-pickers"),
        DatePicker: ({ label, defaultValue, maxDate, ...props }: { label: string, defaultValue: object, maxDate: object }) => (
            <div>
                <div>{label}</div>
                <input
                    type="date"
                    max={DateUtils.formatDate(maxDate as Date)}
                    defaultValue={DateUtils.formatDate(defaultValue as Date)}
                //max={`${maxDate["year"]()}-${maxDate["month"]()}-${maxDate["day"]()}`}
                //defaultValue={`${defaultValue["year"]()}-${defaultValue["month"]()}-${defaultValue["day"]()}`}
                />
            </div>
        )
    }
});

jest.mock("notistack", () => {
    const actual = jest.requireActual("notistack");
    return {
        ...actual,
        useSnackbar: jest.fn()
    };
});

/*jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn((state:Partial<AppState>)=>{
        return state
    })
}));*/

describe("Device main infos Filter table render (no filter)", () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    /**
     * Mock ``enqueueSnackbar`` function
     * @returns {jest.Mock} Mocked ``enqueueSnackbar`` function
     */
    const initEnqueueSnackbarMock = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn((message: string, variants) => "");
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        return mockEnqueueSnackbar
    }

    /**
     * Render the `SoftwaresOrigin` component with the Apollo query and store mocks
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
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("loadingSnapshot")
        const store = renderWithProviders(initialState)

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
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device)
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", undefined, device)

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Unsuccessful render", async () => {
        // Before
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("snapshotError")
        const store = renderWithProviders(initialState)

        // Acts
        const apolloMocks = initApolloMock("snapshotError")
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Row selected : footer displayed", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter("File", "name", "<", 3 as any as object, 1)
        ]
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
        const rowFileCell = container.querySelector(".MuiDataGrid-row")

        if (rowFileCell === null) {
            throw new Error("No row : test fail!")
        }

        fireEvent.click(rowFileCell)

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

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const newFilterForm = container.querySelector('[class="newElementDialog"]') as HTMLDivElement
        expect(newFilterForm).toBeInTheDocument()
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

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const fieldNameSelect = (
            (newFilterDialogRootNode as HTMLElement).children[1] as HTMLSelectElement
        ).querySelector("select") as HTMLSelectElement
        expect(fieldNameSelect).toBeInTheDocument()
        userEvent.selectOptions(fieldNameSelect, "creationDate")

        const fieldInput = (container.querySelector('[id="datePicker"]')!.children[0].children[1]) as HTMLSelectElement

        // Asserts
        expect(fieldInput).toBeInTheDocument()
        expect(fieldInput.getAttribute("value")).toBe("2000-01-01")
    })

    test("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)


        const enqueueSnackbarMock = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const addFilterButton = newFilterDialogRootNode?.childNodes.item(4)
        fireEvent.click(addFilterButton as ChildNode)

        // Asserts
        expect(enqueueSnackbarMock).toHaveBeenCalledWith("You must enter a value for the filter to create it!", { variant: "error" })
    })

    test("Trying to add new filter without setting value should trigger a notification display",
        async () => {
            // Given
            const snapshot = new SnapshotData()
            const filters: Filter[] = []
            snapshot.addSoftware("test", "test software", "1.0")

            const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
            const store = renderWithProviders(initialState)

            initEnqueueSnackbarMock()

            const apolloMocks = initApolloMock("success", snapshot)
            const { container } = renderMockedComponent(store, apolloMocks)

            // Acts
            const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
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

    test("Pressing tab key should focus other element", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const inputs = {
            elementTypeSelect: newFilterDialogRootNode?.childNodes.item(0) as HTMLElement,
            fieldNameSelect: newFilterDialogRootNode?.childNodes.item(1) as HTMLElement,
            comparisonSelect: newFilterDialogRootNode?.childNodes.item(2) as HTMLElement,
            fieldValueInput: newFilterDialogRootNode?.childNodes.item(3) as HTMLElement
        }

        Object.keys(inputs).map((key: string) => {
            inputs[key] = inputs[key].querySelector('input, select')
        })


        fireEvent.keyDown(inputs.fieldValueInput, {
            key: "Tab",
            code: "Tab"
        })

        // Asserts
        Object.keys(inputs).forEach((key: string) => {
            if (key === "fieldValueInput") {
                expect(inputs[key]).toHaveFocus()
            } else {
                expect(inputs[key]).not.toHaveFocus()
            }
        })
    })

    test("Adding element (no filter yet added!) and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[id="deviceMainInfosFilterValueField"]') as HTMLInputElement
        const newElementDialog = container.querySelector(".newElementDialog")

        userEvent.type(fieldValueInput, "Test value")

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
        expect(newElementDialog).not.toBeInTheDocument()
        expect(screen.getByText("Test value")).toBeInTheDocument()
    })

    test("Entering value and emptying it should display toast notification (empty value)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[id="deviceMainInfosFilterValueField"]') as HTMLInputElement

        userEvent.type(fieldValueInput, "t")

        expect(fieldValueInput).toHaveValue("t")

        userEvent.clear(fieldValueInput)

        const helperText = container.querySelector("#deviceMainInfosFilterValueField")

        // Asserts
        expect(fieldValueInput).toBeInTheDocument()
        expect(helperText).toBeInTheDocument()
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

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        userEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[id="deviceMainInfosFilterValueField"]') as HTMLInputElement;
        fireEvent.change(fieldValueInput, { target: { value: "Test value!" } });

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("The filter is already set! It will be ignored!", { variant: "warning" })
    })

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

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value2!" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Another filter has this id!", { variant: "warning" })
        expect(fieldValueInput).toBeInTheDocument()
    })

    test("Adding filter with invalid element type", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)


        // Acts
        const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
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

        // Asserts
        expect(fieldValueInput).not.toBeInTheDocument()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("The input type file set is not valid. The only ones accepted are : \"File\" or \"Library\".", { variant: "error" })
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

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", snapshot)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()
        
        const { container } = renderMockedComponent(store, apolloMocks)


        // Acts
        for (let i = 0; i <= 1; i++) {
            const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
            fireEvent.click(newFilterButton)

            /*fieldValueInput = container.querySelector("#deviceMainInfosFilterValueField") as HTMLInputElement*/
            const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement
            fireEvent.change(fieldValueInput, { target: { value: `Test value${i}` } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
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
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)


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
        /*
        rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )*/

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
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)


        // Acts
        const rowCheckbox = (screen.getByText(`test0`).parentNode as ParentNode).querySelector("input") as HTMLInputElement
        fireEvent.click(rowCheckbox)
        store.dispatch({
            type: "filter/updateSelectedFilter",
            payload: [0]
        })

        /*rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )*/

        const filterDeleteButton = screen.getByText("Delete filters")
        fireEvent.click(filterDeleteButton)
        store.dispatch({
            type: "filter/deleteFilter",
            payload: [0]
        })

        /*rerender(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )*/

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
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)


        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        const fieldNameInput = (screen.getAllByText("Field name")[0].parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValue = screen.getByText("Field value").parentElement!
        const inputField = fieldValue.querySelector("input") as HTMLInputElement
        //const fieldValueType = fieldValue.querySelector("button") as HTMLInputElement

        //fireEvent.click(fieldValueType)
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

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)


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
    })
})
