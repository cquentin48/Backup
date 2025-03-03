import React, { type ReactNode } from "react"

import { type FetchResult } from "@apollo/client"
import { type ResultFunction, MockedProvider } from "@apollo/client/testing"

import { Dispatch, type EnhancedStore, configureStore } from "@reduxjs/toolkit"

import '@testing-library/jest-dom'
import { fireEvent, screen, render, waitFor, type RenderResult } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SnackbarProvider, useSnackbar } from "notistack"
import { Provider, useDispatch, useSelector } from "react-redux"

import snapshotReducer, { type SnapshotSliceState } from "../../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"
import filterReducer, { type FilterSliceState } from "../../../../../main/app/controller/deviceMainInfos/filterSlice"
import deviceReducer, { type FetchDeviceSliceState } from "../../../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import Device from "../../../../../main/app/model/device/device"
import NotFoundError from "../../../../../main/app/model/exception/errors/notFoundError"
import Filter from "../../../../../main/app/model/filters/Filter"
import gqlClient from "../../../../../main/app/model/queries/client"
import { type LoadSnapshotQueryResult } from "../../../../../main/app/model/queries/computer/loadSnapshot"
import { SnapshotData } from "../../../../../main/app/model/snapshot/snapshotData"
import FilterTable from "../../../../../main/app/view/pages/computer/sections/filters/table"

import FETCH_SNAPSHOT from '../../../../../main/res/queries/snapshot.graphql';
import { filterManager } from "../../../../../main/app/model/filters/FilterManager"
import { DataGridProps } from "@mui/x-data-grid"

/**
 * Preloaded state used for the mocks in the tests
 */
interface MockedPreloadedState {
    /**
     * Snapshot defined in the snapshot slice
     */
    filters: FilterSliceState

    snapshot: SnapshotSliceState

    device: FetchDeviceSliceState
}

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
}))

describe("Device main infos Filter table render (no filter)", () => {
    beforeEach(() => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        gqlClient.get_query_client().query = initGraphQLMock()
    })
    afterAll(() => {
        jest.resetAllMocks()
    })

    /**
     * Init the ``useSelector`` mock for the unit test
     * @param {"init" | "success" | "failure" | "loading"} operationStatus Mocked operation status in the test
     * @param {SnapshotData} snapshot Snapshot used for the test
     * @param {Filter[]} filters Filter(s) used for the test
     * @param {Device} device Device used for the mock used in a test
     */
    const initUseSelectorMock = (operationStatus: "init" | "success" | "failure" | "loading", snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, filters: Filter[] = [], selectedFilteredIDS: number[] = []): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        mockedUseSelector.mockImplementation((selector) => {
            return selector(
                {
                    filter: {
                        filters,
                        selectedFilteredIDS: [],
                        filterError: {
                            message: operationStatus === "failure" ? "Error raised in test" : "",
                            variant: operationStatus === "failure" ? "Error raised in test" : undefined
                        }
                    },
                    snapshot: {
                        snapshotError: operationStatus === "failure" ? "Error raised here!" : "",
                        operationStatus,
                        snapshot: operationStatus === "success" ? snapshot : undefined
                    },
                    device: {
                        device,
                        error: {
                            message: "",
                            variant: undefined
                        },
                        deviceLoading: false
                    }
                }
            )
        }
        )
    }

    /**
     * Render the SoftwaresOrigin component with the Apollo query and store mocks
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Fetch snapshot operation stage
     * @param {SnapshotData | undefined} snapshot Provided snapshot for the success fetch snapshot data
     * @param {EnhancedStore} store Redux mocked store
     * @returns {NotFoundError} If the operation is marked as a success and no snapshot is provided.
     */
    const renderMockedComponent = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined, store: EnhancedStore): RenderResult => {

        let snapshotResult: FetchResult<LoadSnapshotQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult>, any> | undefined;

        if (operationStatus === "success") {
            if (snapshot === undefined && operationStatus !== "success") {
                throw new NotFoundError("Invalid operation : if the test type is a success, the snapshot must be defined!")
            }
            snapshotResult = {
                data: {
                    snapshotInfos: snapshot as SnapshotData
                }
            }

        } else if (operationStatus === "failure") {
            const errorMessage = "Raised error message here!"
            snapshotResult = {
                errors: [
                    {
                        message: errorMessage
                    }
                ]
            }
        }
        const apolloMocks = [
            {
                request: {
                    query: FETCH_SNAPSHOT
                },
                result: snapshotResult
            }
        ]
        jest.fn().mockReturnValue(async () =>
            await Promise.resolve(
                {
                    result: {
                        data: {
                            snapshotInfos: snapshot as SnapshotData
                        }
                    }
                }
            )
        )

        gqlClient.get_query_client().query = jest.fn().mockImplementation(async ({ query }) =>
            await Promise.resolve(
                snapshotResult
            )
        )


        return render(<Provider store={store}>
            <MockedProvider mocks={apolloMocks} addTypename={false}>
                <SnackbarProvider>
                    <FilterTable />
                </SnackbarProvider>
            </MockedProvider>
        </Provider>)
    }

    /**
     * Initialise the test
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Type of operation mocked for the unit test
     * @param {SnapshotData | undefined} snapshot Device snapshot used in the unit test
     * @param {Filter[]} filters Filters used in the unit test
     * @param {Device |undefined} device device used for the mock
     * @returns {EnhancedStore} Mocked store
     * @throws {Error} If the test stage is not in the list
     */
    const initStore = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, filters: Filter[] = [], selectedFiltersIDs: number[] = []): EnhancedStore => {
        if (device === undefined && snapshot === undefined && operationStatus === "success") {
            throw new Error("The snapshot and the device must be defined if the loading snapshot data with a GraphQL query is successful!")
        }
        const preloadedState: MockedPreloadedState = {
            
            filters: {
                filters,
                filterError: {
                    message: operationStatus === "failure" ? "Snapshot : Error raised here!" : "",
                    variant: operationStatus === "failure" ? "error" : undefined
                },
                selectedFilteredIDS: selectedFiltersIDs
            },
            device: {
                device,
                deviceError: {
                    message: operationStatus === "failure" ? "Snapshot : Error raised here!" : "",
                    variant: operationStatus === "failure" ? "error" : undefined
                },
                deviceLoading: operationStatus === "initial" || operationStatus === "loading"
            },snapshot: {
                snapshot,
                snapshotError: operationStatus === "failure" ? "Device : Error raised here!" : "",
                operationStatus: "success"
            }
        }
        return configureStore({
            reducer: {
                device: deviceReducer,
                snapshot: snapshotReducer,
                filters: filterReducer
            },
            preloadedState
        })
    }

    /**
     * Init graphql query mock for the unit tests
     * @returns {jest.Mock} Mocked graphql query function
     */
    const initGraphQLMock = (): jest.Mock => {
        const snapshotQueryOutput = {
            data: {
                snapshotInfos: {
                    versions: [
                        {
                            name: "My software",
                            chosenVersion: "type",
                            installType: "1.0"
                        }
                    ],
                    repositories: []
                }
            }
        }
        return jest.fn().mockReturnValue(snapshotQueryOutput)
    }

    test("Initial render", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });

        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device())
        initUseSelectorMock("success", snapshot, new Device(), [])

        // Acts
        const { container } = renderMockedComponent("success", snapshot, store)

        // Asserts
        const footer = container.querySelector("#GridFooterNoContent")
        expect(footer).toBeInTheDocument()
    })

    test("Row selected : footer displayed", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters = [
            new Filter(
                "File",
                "name",
                "<",
                "apt" as any as object,
                0
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock("success", snapshot, new Device(), filters)

        const mockedDispatch: Dispatch = jest.fn((action) => {
            store.dispatch({
                type: "updateSelectedFilter"
            })
            store = initStore("success", snapshot, new Device(), filters, [0])
            return action
        });

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const { container } = renderMockedComponent("success", snapshot, store)

        // Acts
        const rowFileCell = container.querySelector(".MuiDataGrid-row")
        if (rowFileCell === null) {
            throw new Error("No row : test fail!")
        }
        userEvent.click(rowFileCell)
        useDispatch()

        // Asserts
        await waitFor(() => {
            expect(screen.findByText("Delete filters")).toBeInTheDocument()
        })
    })

    test.skip("New filter button should render form successfully", async () => {
        // Given

        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

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
        // Given
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const inputTypeSelect = (newFilterDialogRootNode as HTMLElement).childNodes.item(0).childNodes.item(1).childNodes.item(1)

        fireEvent.change(inputTypeSelect, { target: { value: "Library" } })
        const fieldNameSelect = (newFilterDialogRootNode as HTMLElement).childNodes.item(1).childNodes.item(1).childNodes.item(1)
        fireEvent.change(fieldNameSelect, { target: { value: "firstUploadDate" } })

        // Asserts
        expect(screen.getByText("firstUploadDate")).toBeInTheDocument()
    })

    test.skip("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider>
        )

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
    })

    test.skip("Trying to add new filter without setting value should launch console.log", async () => {
        // Given
        const { container } = render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

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
    })

    test.skip("Pressing tab key should focus other element", async () => {
        // Given

        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

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
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
        await waitFor(() => {
            expect(screen.getByText("Test value")).toBeInTheDocument()
        }, { timeout: 2500 })
        expect(fieldValueInput).not.toBeInTheDocument()
    })

    test.skip("Entering value and emptying it should display helper text", async () => {
        // Given
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

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

        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider>
        )

        // Acts
        let fieldValueInput;
        for (let i = 0; i <= 1; i++) {
            const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
            userEvent.click(newFilterButton)
            fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

            fireEvent.change(fieldValueInput, { target: { value: "Test value" } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
        }

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
        const rows = ((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).children[1].children[1].children[1].children[0].querySelector(".MuiDataGrid-row")
        await waitFor(() => {
            expect(rows).toBeInTheDocument()
        }, { timeout: 2500 })
        expect(fieldValueInput).toBeInTheDocument()
        // expect(enqueueSnackbar).toBeCalled()

    })

    test.skip("Adding two filters and pressing enter key", async () => {
        // Given
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider>
        )

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

        // Asserts
        const rows = ((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).querySelector(".MuiDataGrid-row")
        expect(filterManager.getFilters().length).toBe(2)
        await waitFor(() => {
            expect(rows).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test.skip("Selecting two added filters", async () => {
        // Given
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

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

        const checkbox = (((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).parentNode as ParentNode).querySelector(".MuiDataGrid-columnHeaderCheckbox")?.querySelector("input") as HTMLInputElement
        fireEvent.click(checkbox)

        // Asserts
        await waitFor(() => {
            expect((screen.getByText("2 filtres sélectionnés!").parentNode as ParentNode).querySelector("p")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test.skip("Delete one filter from three previously added", async () => {
        // Given

        const { getByText } = render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider>
        )

        // Acts
        const newFilterButton = getByText("New filter") as HTMLInputElement
        for (let i = 0; i <= 2; i++) {
            userEvent.click(newFilterButton)
            const fieldValueInput = (getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement
            fireEvent.change(fieldValueInput, { target: { value: `Test value${i}` } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
        }

        for (let i = 0; i <= 1; i++) {
            const rowCheckbox = (screen.getByText(`Test value${i}`).parentNode as ParentNode).querySelector("input") as HTMLInputElement
            fireEvent.click(rowCheckbox)
        }
        const filterDeleteButton = screen.getByText("Delete filters")
        fireEvent.click(filterDeleteButton)

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
    }, 5000)

    test.skip("Selecting date in the input field name from the new filter Form", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2020-01-13'))

        // Given
        jest.mock("@mui/material/Select", () => (...rest: any) => {
            <div>
                <input data-testid='mocked-select' {...rest} />
            </div>
        })
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider >
        )

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
        jest.useFakeTimers().setSystemTime(new Date('2020-01-13'))
        // Given
        jest.mock("@mui/material/Select", () => (...rest: any) => {
            <div>
                <input data-testid='mocked-select' {...rest} />
            </div>
        })
        render(
            <SnackbarProvider>
                <FilterTable />
            </SnackbarProvider>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)

        const fieldNameInput = (screen.getAllByText("Field name")[0].parentElement as HTMLElement).querySelector("input") as HTMLInputElement
        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValue = screen.getByText("Field value").parentElement as HTMLElement

        const inputField = fieldValue.querySelector("input") as HTMLInputElement
        userEvent.type(inputField, "01/10/2020")
        const newDate = inputField.value
        const fieldValueType = fieldValue.querySelector("button") as HTMLInputElement
        fireEvent.click(fieldValueType)

        // Asserts
        expect(inputField.getAttribute("placeholder")).toBe("MM/DD/YYYY")
        expect(newDate).toBe("01/10/2020")
    })
})
