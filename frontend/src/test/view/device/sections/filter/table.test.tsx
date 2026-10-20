import React, { ChangeEventHandler } from "react"
import dayjs from 'dayjs';

import { MockedProvider } from "@apollo/client/testing"

import { type DataGridProps } from "@mui/x-data-grid"
import userEvent from "@testing-library/user-event"

import { type EnhancedStore } from "@reduxjs/toolkit"

import '@testing-library/jest-dom'
import { fireEvent, screen, render, waitFor, type RenderResult } from "@testing-library/react"

import { SnackbarProvider, useSnackbar } from "notistack"
import { Provider } from "react-redux"

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
                ref: any, inputRef: (ref: never) => void, helperText: boolean | string
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
        DatePicker: ({ label, defaultValue, maxDate, onChange, onAccept, slotProps, autoFocus }) => (
            <div>
                <div id={slotProps['textField']['id']}>{label}</div>
                <input
                    type="date"
                    max={DateUtils.formatDate(maxDate as Date)}
                    defaultValue={DateUtils.formatDate(defaultValue as Date)}
                    onChange={(e) => {
                        const newValue = e.target.value ? dayjs(e.target.value) : null;
                        if (newValue) {
                            onChange?.(newValue);
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value) {
                            onAccept?.(dayjs(e.target.value));
                        }
                    }}
                    autoFocus={autoFocus}
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
                "New filter !" as unknown as object,
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

    test("Adding two filters and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter(
                "File",
                "name",
                "<",
                "New filter 0!" as unknown as object,
                0
            ), new Filter(
                "File",
                "name",
                "<",
                "New filter 1!" as unknown as object,
                1
            ),
        ]
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), [])
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", snapshot)

        initEnqueueSnackbarMock()

        const { container, rerender } = renderMockedComponent(store, apolloMocks)


        // Acts
        filters.forEach((filter) => {
            const newFilterButton = container.querySelector('[class="newFilterButton"]') as HTMLButtonElement
            fireEvent.click(newFilterButton)

            const fieldValueInput = container.querySelector("#deviceMainInfosFilterValueField") as HTMLInputElement;
            fireEvent.change(fieldValueInput, { target: { value: filter.value } });

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            });

            rerender(
                <Provider store={store}>
                    <MockedProvider mocks={Array.from(apolloMocks.values())}>
                        <SnackbarProvider>
                            <FilterTable />
                        </SnackbarProvider>
                    </MockedProvider>
                </Provider>
            );
        })

        // Asserts
        const rows = Array.from(container.querySelector("tbody")!.children);
        expect(rows.length).toBe(filters.length)

        for (let i = 0; i < filters.length; i++) {
            const currentFilter = filters[i];
            const rowElements = Array.from(rows[i].children)

            const foundFieldName = rowElements[1].innerHTML
            const foundType = rowElements[2].innerHTML
            const foundData = rowElements[3].innerHTML

            expect(foundFieldName).toBe(currentFilter.id.toString())
            expect(foundType).toBe(currentFilter.elementType)
            expect(foundData).toBe(currentFilter.fieldName)
        }
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

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, rerender } = renderMockedComponent(store, apolloMocks)


        // Acts
        let fieldValueInput;
        Array.from(container.querySelectorAll('.MuiDataGrid-row')).forEach((row) => {
            fireEvent.click(row);
        });

        // Asserts
        const footer = container.querySelector('#GridFooterContent');
        const footerSelectedElements = footer!.children[0].innerHTML;
        const expectedText = `${filters.length} filtres sélectionnés!`;
        expect(footerSelectedElements).toBe(expectedText)
    })

    test("Delete one filter from two previously added", async () => {
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

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks)

        // Acts
        const displayedFiltersCount = Array.from(container.querySelectorAll('.MuiDataGrid-row')).length;
        const rowCheckbox = (Array.from(container.querySelectorAll('.MuiDataGrid-row')))[0].querySelector("input") as HTMLInputElement
        fireEvent.click(rowCheckbox)

        const filterDeleteButton = screen.getByText("Delete filters")
        fireEvent.click(filterDeleteButton)

        // Asserts
        expect(displayedFiltersCount).toBe(filters.length)
        expect(Array.from(container.querySelectorAll('.MuiDataGrid-row'))).toHaveLength(filters.length - 1)
        expect(container.querySelector('#GridFooterNoContent')).toBeInTheDocument()
    })

    test("Selecting date in the input field name from the new filter Form", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2020-01-13'));

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
        const fieldNameInput = container.querySelector('#fieldName') as HTMLSelectElement

        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValueInput = container.querySelector("#datePicker")!.querySelector('input') as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: '2020-01-11' } });

        const updatedDate = fieldValueInput.value;

        // Asserts
        expect(updatedDate).toBe("2020-01-11")
    })
})