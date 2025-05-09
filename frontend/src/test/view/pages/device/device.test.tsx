import React, { type ReactNode } from "react"

import { type DocumentNode, type FetchResult } from "@apollo/client"
import { MockedProvider, type ResultFunction } from "@apollo/client/testing"
import { type DataGridProps } from "@mui/x-data-grid"
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit"
import '@testing-library/jest-dom'
import { render, type RenderResult } from "@testing-library/react"

import { Provider, useDispatch, useSelector } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { useSnackbar } from "notistack"

import { dataManager } from "../../../../main/app/model/AppDataManager"
import Device from "../../../../main/app/model/device/device"
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError"
import { type DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos"
import { type LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"

import snapshotReducer, { type SnapshotSliceState } from "../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"
import filterReducer from "../../../../main/app/controller/deviceMainInfos/filterSlice"
import deviceReducer, { type FetchDeviceSliceState } from "../../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import chatbotReducer, { ChatbotSliceState } from "../../../../main/app/controller/deviceMainInfos/chatbotSlice";
import { type OperationStatus, type AppState } from "../../../../main/app/controller/store"

import ComputerPage from "../../../../main/app/view/pages/computer/computerPage"

import FETCH_DEVICE from '../../../../main/res/queries/computer_infos.graphql';
import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';

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
    return async ({ children }: { children: ReactNode }) => await children;
});

jest.mock('@mui/material/transitions', () => ({
    ...jest.requireActual('@mui/material/transitions'),
    useTransitionProps: () => ({ timeout: 0 })
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ id: '1' }))
}));

jest.mock("notistack", () => ({
    ...jest.requireActual("notistack"),
    useSnackbar: jest.fn()
}));

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

/**
 * Preloaded state used for the mocks in the tests
 */
interface MockedPreloadedState {
    /**
     * Snapshot defined in the snapshot slice
     */
    snapshot: SnapshotSliceState

    device: FetchDeviceSliceState

    chatbot: ChatbotSliceState;
}

interface ApolloMockResult {
    request: {
        query: DocumentNode
    }
    result: FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult>, any> | undefined
}

describe("Device page", () => {
    afterEach(() => {
        dataManager.removeAllData()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    const renderMockedComponent = (store: EnhancedStore<AppState>, apolloMocks: ApolloMockResult[]): RenderResult => {
        return render(
            <BrowserRouter>
                <Provider store={store}>
                    <MockedProvider mocks={apolloMocks} addTypename={false}>
                        <ComputerPage />
                    </MockedProvider>
                </Provider>
            </BrowserRouter>
        )
    }

    /**
     * Initialise the test
     * @param {OperationStatus} operationStatus Type of operation mocked for the unit test
     * @param {SnapshotData | undefined} snapshot Device snapshot used in the unit test
     * @param {Device | undefined} device device used for the mock
     * @returns {EnhancedStore} Mocked store
     * @throws {Error} If the test stage is not in the list
     */
    const initStore = (operationStatus: OperationStatus, snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined): EnhancedStore<AppState> => {
        if (device === undefined && snapshot === undefined && operationStatus === "success") {
            throw new Error("The snapshot and the device must be defined if the operation is supposed to be successful!")
        }
        const parsedDevice = device !== undefined ? JSON.parse(JSON.stringify(device)) : undefined
        const parsedSnapshot = snapshot !== undefined ? JSON.parse(JSON.stringify(snapshot)) : undefined

        const preloadedState: MockedPreloadedState = {
            device: {
                device: parsedDevice,
                deviceError: {
                    message: operationStatus === "error" ? "Snapshot : Error raised here!" : "",
                    variant: operationStatus === "error" ? "error" : undefined
                },
                deviceLoading: operationStatus === "initial" || operationStatus === "loading"
            },
            snapshot: {
                snapshot: parsedSnapshot,
                snapshotError: {
                    message: operationStatus === "error" ? "Device : Error raised here!" : "",
                    variant: operationStatus === "error" ? "error" : undefined
                },
                operationStatus: "success"
            },
            chatbot:{
                currentConversationID: -1,
                conversationHeaders: [],
                messages: []
            }
        }
        return configureStore({
            reducer: {
                device: deviceReducer,
                snapshot: snapshotReducer,
                filter: filterReducer,
                chatbot: chatbotReducer
            },
            preloadedState
        })
    }

    /**
     * Init jest mock for the method ``enqueueSnackbar`` from the library ``notistack``
     * @returns {jest.Mock} mocked method
     */
    const initEnqueueSnackbarHook = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });
        return mockEnqueueSnackbar
    }

    const mockApolloCalls = (operationStatus: OperationStatus, snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined): ApolloMockResult[] => {
        let snapshotResult: FetchResult<LoadSnapshotQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult>, any> | undefined;
        let deviceResult: FetchResult<DeviceInfosQueryResult> | ResultFunction<FetchResult<DeviceInfosQueryResult>, any> | undefined;

        if (operationStatus === "success") {
            if (snapshot === undefined && operationStatus !== "success") {
                throw new NotFoundError("Invalid operation : if the test type is a success, the snapshot must be defined!")
            }
            snapshotResult = {
                data: {
                    snapshotInfos: snapshot as SnapshotData
                }
            }
            if (device === undefined && operationStatus !== "success") {
                throw new NotFoundError("Invalid operation : if the test type is a success, the device must be defined!")
            }
            deviceResult = {
                data: {
                    deviceInfos: device as Device
                }
            }

        } else if (operationStatus === "error") {
            const errorMessage = "Raised error message here!"
            snapshotResult = {
                errors: [
                    {
                        message: errorMessage
                    }
                ]
            }
            deviceResult = {
                errors: [
                    {
                        message: errorMessage
                    }
                ]
            }
        }
        return [
            {
                request: {
                    query: FETCH_SNAPSHOT
                },
                result: snapshotResult
            },
            {
                request: {
                    query: FETCH_DEVICE
                },
                result: deviceResult
            }
        ]
    }

    /**
     * Init the ``useSelector`` mock for the unit test
     * @param {EnhancedStore<AppState>} store Mocked state
     */
    const initUseSelectorMock = (store: EnhancedStore<AppState>): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        mockedUseSelector.mockImplementation((selector: (state: AppState) => unknown) => {
            const state = store.getState()

            const deviceState = state.device
            const snapshotState = state.snapshot

            return selector(
                {
                    filter: {
                        filters: [],
                        selectedFilteredIDS: [],
                        filterError: {
                            message: "",
                            variant: undefined
                        }
                    },
                    snapshot: {
                        snapshotError: snapshotState.snapshotError,
                        operationStatus: snapshotState.operationStatus,
                        snapshot: snapshotState.snapshot !== undefined ? JSON.parse(JSON.stringify(snapshotState.snapshot)) : undefined
                    },
                    device: {
                        device: deviceState.device !== undefined ? JSON.parse(JSON.stringify(deviceState.device)) : undefined,
                        deviceError: {
                            message: deviceState.deviceError.message,
                            variant: deviceState.deviceError.variant
                        },
                        deviceLoading: false
                    },
                    chatbot: {
                        currentConversationID: -1,
                        conversationHeaders: [],
                        messages: []
                    }
                }
            )
        }
        )
    }

    test("Initial render (loading data)", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarHook()

        const apolloMocks = mockApolloCalls("loading")
        const store = initStore("loading", undefined, undefined)
        initUseSelectorMock(store)

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render", async () => {
        // Before
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "test")
        const device = new Device(
            "my device!"
        )

        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarHook()

        const apolloMocks = mockApolloCalls("success", snapshot, device)
        const store = initStore("success", snapshot, device)
        initUseSelectorMock(store)

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
        expect(document.title).toBe(`Backup - device ${device.name}`)
    })

    test("Initial render (error)", async () => {
        // Before
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "test")
        const device = new Device()

        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarHook()

        const apolloMocks = mockApolloCalls("error", snapshot, device)
        const store = initStore("error", snapshot, device)
        initUseSelectorMock(store)

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
        expect(document.title).toBe(`Backup - unknown device`)
    })
})
