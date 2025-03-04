import React, { type ReactNode } from "react"

import { DocumentNode, type FetchResult } from "@apollo/client"
import { type ResultFunction, MockedProvider } from "@apollo/client/testing"

import { DataGridProps } from "@mui/x-data-grid"

import { type EnhancedStore, configureStore } from "@reduxjs/toolkit"

import '@testing-library/jest-dom'
import { fireEvent, screen, render, waitFor, type RenderResult } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SnackbarProvider, useSnackbar } from "notistack"
import { Provider, useDispatch, useSelector } from "react-redux"

import snapshotReducer, { type SnapshotSliceState } from "../../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"
import filterReducer, { type FilterSliceState } from "../../../../../main/app/controller/deviceMainInfos/filterSlice"
import deviceReducer, { type FetchDeviceSliceState } from "../../../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import { AppDispatch, AppState } from "../../../../../main/app/controller/store"

import Device from "../../../../../main/app/model/device/device"
import NotFoundError from "../../../../../main/app/model/exception/errors/notFoundError"
import Filter from "../../../../../main/app/model/filters/Filter"
import gqlClient from "../../../../../main/app/model/queries/client"
import { type LoadSnapshotQueryResult } from "../../../../../main/app/model/queries/computer/loadSnapshot"
import { SnapshotData } from "../../../../../main/app/model/snapshot/snapshotData"

import FilterTable from "../../../../../main/app/view/pages/computer/sections/filters/table"

import FETCH_SNAPSHOT from '../../../../../main/res/queries/snapshot.graphql';


/**
 * Preloaded state used for the mocks in the tests
 */
interface MockedPreloadedState {
    /**
     * Snapshot defined in the snapshot slice
     */
    filter: FilterSliceState

    snapshot: SnapshotSliceState

    device: FetchDeviceSliceState
}

interface ApolloMockResult {
    request: {
        query: DocumentNode;
    };
    result: FetchResult<LoadSnapshotQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult>, any> | undefined;
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
}));

describe("Device main infos Filter table render (no filter)", () => {
    beforeEach(() => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        gqlClient.get_query_client().query = initGraphQLMock()
    })
    afterEach(() => {
        jest.resetAllMocks()
    })

    /**
     * Init the ``useSelector`` mock for the unit test
     * @param {"init" | "success" | "failure" | "loading"} operationStatus Mocked operation status in the test
     * @param {SnapshotData} snapshot Snapshot used for the test
     * @param {Filter[]} filters Filter(s) used for the test
     * @param {Device} device Device used for the mock used in a test
     */
    const initUseSelectorMock = (store: EnhancedStore<AppState>): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        mockedUseSelector.mockImplementation((selector: (state: AppState) => unknown) => {
            const state = store.getState()

            const filterState = state.filter
            const deviceState = state.device
            const snapshotState = state.snapshot

            return selector(
                {
                    filter: {
                        filters: JSON.parse(JSON.stringify(filterState.filters)),
                        selectedFilteredIDS: filterState.selectedFilteredIDS,
                        filterError: {
                            message: filterState.filterError.message,
                            variant: filterState.filterError.variant
                        }
                    },
                    snapshot: {
                        snapshotError: snapshotState.snapshotError,
                        operationStatus: snapshotState.operationStatus,
                        snapshot: snapshotState.snapshot !== undefined ? JSON.parse(JSON.stringify(snapshotState.snapshot)) : undefined,
                    },
                    device: {
                        device: deviceState.device !== undefined ? JSON.parse(JSON.stringify(deviceState.device)) : undefined,
                        deviceError: deviceState.deviceError !== undefined ? {
                            message: deviceState.deviceError.message,
                            variant: deviceState.deviceError.variant
                        } : undefined,
                        deviceLoading: false
                    }
                }
            )
        }
        )
    }

    const initApolloMock = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined): ApolloMockResult[] => {
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
        } else {
            snapshotResult = {
                data: {
                    snapshotInfos: new SnapshotData()
                }
            }
        }
        return [
            {
                request: {
                    query: FETCH_SNAPSHOT
                },
                result: snapshotResult
            }
        ]
    }

    /**
     * Render the SoftwaresOrigin component with the Apollo query and store mocks
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Fetch snapshot operation stage
     * @param {SnapshotData | undefined} snapshot Provided snapshot for the success fetch snapshot data
     * @param {EnhancedStore} store Redux mocked store
     * @returns {NotFoundError} If the operation is marked as a success and no snapshot is provided.
     */
    const renderMockedComponent = (store: EnhancedStore, apolloMocks: ApolloMockResult[]): RenderResult => {

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
    const initStore = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, filters: Filter[] = [], selectedFiltersIDs: number[] = []): EnhancedStore<AppState> => {
        if (device === undefined && snapshot === undefined && operationStatus === "success") {
            throw new Error("The snapshot and the device must be defined if the loading snapshot data with a GraphQL query is successful!")
        }
        const parsedFilters = filters !== undefined ? JSON.parse(JSON.stringify(filters)) : undefined
        const parsedDevice = device !== undefined ? JSON.parse(JSON.stringify(device)) : undefined
        const parsedSnapshot = snapshot !== undefined ? JSON.parse(JSON.stringify(snapshot)) : undefined

        const preloadedState: MockedPreloadedState = {

            filter: {
                filters: parsedFilters,
                filterError: {
                    message: operationStatus === "failure" ? "Snapshot : Error raised here!" : "",
                    variant: operationStatus === "failure" ? "error" : undefined
                },
                selectedFilteredIDS: selectedFiltersIDs
            },
            device: {
                device: parsedDevice,
                deviceError: {
                    message: operationStatus === "failure" ? "Snapshot : Error raised here!" : "",
                    variant: operationStatus === "failure" ? "error" : undefined
                },
                deviceLoading: operationStatus === "initial" || operationStatus === "loading"
            },
            snapshot: {
                snapshot: parsedSnapshot,
                snapshotError: operationStatus === "failure" ? "Device : Error raised here!" : "",
                operationStatus: "success"
            }
        }
        return configureStore({
            reducer: {
                device: deviceReducer,
                snapshot: snapshotReducer,
                filter: filterReducer
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

    test("Pending data render", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });

        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("loading")

        initUseSelectorMock(store)

        // Acts
        const apolloMocks = initApolloMock("loading", snapshot)
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

        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("success", snapshot, new Device())

        initUseSelectorMock(store)

        // Acts
        const apolloMocks = initApolloMock("success", snapshot)
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

        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")
        const store = initStore("failure")

        initUseSelectorMock(store)

        // Acts
        const apolloMocks = initApolloMock("failure", snapshot)
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
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
        initUseSelectorMock(store)

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, rerender } = renderMockedComponent(store, apolloMocks)

        // Acts
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
                <MockedProvider mocks={apolloMocks} addTypename={false}>
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
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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

    test("When the user changes the type of filter, the input type should be updated", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2000-01-01'))

        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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

    test("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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
        expect(useSnackbar).toHaveBeenCalled()
    })

    test("Trying to add new filter without setting value should launch console.log", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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

    test("Pressing tab key should focus other element", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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

    test("Adding element (no filter yet added!) and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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

    test("Entering value and emptying it should display toast notification (empty value)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

        const mockedDispatch: AppDispatch = jest.fn();

        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch)

        const apolloMocks = initApolloMock("success", snapshot)
        renderMockedComponent(store, apolloMocks)

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
        expect(fieldValueInput).not.toBeInTheDocument()
        expect(useSnackbar).toBeCalled()

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
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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
            ),
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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
            payload: [0,1]
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
            ),
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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
        const filters:Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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
        const filters:Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        let store = initStore("success", snapshot, new Device(), filters)
        initUseSelectorMock(store)

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
    })
})
