import React from "react";

import { type DocumentNode, type FetchResult } from "@apollo/client";
import { type ResultFunction, MockedProvider } from "@apollo/client/testing";

import { type EnhancedStore, configureStore } from "@reduxjs/toolkit";

import { type RenderResult, render } from "@testing-library/react";

import { SnackbarProvider, useSnackbar } from "notistack";

import { useSelector, Provider, useDispatch } from "react-redux";

import snapshotReducer from "../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"
import filterReducer from "../../../../main/app/controller/deviceMainInfos/filterSlice"
import deviceReducer from "../../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import chatbotReducer from "../../../../main/app/controller/deviceMainInfos/chatbotSlice"
import { type AppState } from "../../../../main/app/controller/store";

import Device from "../../../../main/app/model/device/device";
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError";
import type Filter from "../../../../main/app/model/filters/Filter";
import gqlClient from "../../../../main/app/model/queries/client";
import { type DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos";
import { type LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";

import LoadingDeviceModal from "../../../../main/app/view/pages/computer/DeviceModal";

import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';
import FETCH_DEVICE from '../../../../main/res/queries/computer_infos.graphql';

interface ApolloMockResult {
    request: {
        query: DocumentNode
    }
    result: FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult>, any> | undefined
}

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

describe("Device loading modal test suite snapshot", () => {
    beforeEach(() => {
        gqlClient.get_query_client().query = initGraphQLMock()
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    /**
     * Mock the ``enqueueSnackbar`` function
     * @returns {jest.Mock} mocked ``enqueueSnackbar`` function
     */
    const initEnqueueSnackbarMock = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        return mockEnqueueSnackbar
    }

    /**
     * Init the ``useSelector`` mock for the unit test
     * @param {EnhancedStore<AppState>} store Mocked redux store
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
                        snapshot: snapshotState.snapshot !== undefined ? JSON.parse(JSON.stringify(snapshotState.snapshot)) : undefined
                    },
                    device: {
                        device: deviceState.device !== undefined ? JSON.parse(JSON.stringify(deviceState.device)) : undefined,
                        deviceError: {
                            message: deviceState.deviceError.message,
                            variant: deviceState.deviceError.variant
                        },
                        deviceLoading: store.getState().device.deviceLoading
                    },
                    chatbot:{
                        conversationHeaders: [],
                        messages: []
                    }
                }
            )
        }
        )
    }

    const initApolloMock = (operationStatus: "success" | "error" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined): ApolloMockResult[] => {
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
        } else {
            snapshotResult = {
                data: {
                    snapshotInfos: new SnapshotData()
                }
            }
            deviceResult = {
                data: {
                    deviceInfos: new Device()
                }
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
     * Render the SoftwaresOrigin component with the Apollo query and store mocks
     * @param {EnhancedStore} store Redux mocked store
     * @param {ApolloMockResult[]} apolloMocks Apollo GraphQL queries mocks result
     * @returns {NotFoundError} If the operation is marked as a success and no snapshot is provided.
     */
    const renderMockedComponent = (store: EnhancedStore, apolloMocks: ApolloMockResult[]): RenderResult => {
        return render(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SnackbarProvider>
                        <LoadingDeviceModal />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )
    }

    /**
     * Initialise the test
     * @param {"success" | "error" | "loading" | "initial"} operationStatus Type of operation mocked for the unit test
     * @param {SnapshotData | undefined} snapshot Device snapshot used in the unit test
     * @param {Device |undefined} device device used for the mock
     * @param {Filter[]} filters Filters used in the unit test
     * @param {number[]} selectedFiltersIDs selected ids for the mock
     * @returns {EnhancedStore} Mocked store
     * @throws {Error} If the test stage is not in the list
     */
    const initStore = (operationStatus: "initial" | "loadingSnapshot" | "loadingDevice" | "success" | "error", snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, filters: Filter[] = [], selectedFiltersIDs: number[] = []): EnhancedStore<AppState> => {
        if (device === undefined && snapshot === undefined && operationStatus === "success") {
            throw new Error("The snapshot and the device must be defined if the loading snapshot data with a GraphQL query is successful!")
        }
        const parsedFilters = filters !== undefined ? JSON.parse(JSON.stringify(filters)) : undefined
        const parsedDevice = device !== undefined ? JSON.parse(JSON.stringify(device)) : undefined
        const parsedSnapshot = snapshot !== undefined ? JSON.parse(JSON.stringify(snapshot)) : undefined

        const preloadedState: AppState = {
            filter: {
                filters: parsedFilters,
                filterError: {
                    message: operationStatus === "error" ? "Snapshot : Error raised here!" : "",
                    variant: operationStatus === "error" ? "error" : undefined
                },
                selectedFilteredIDS: selectedFiltersIDs
            },
            device: {
                device: parsedDevice,
                deviceError: {
                    message: operationStatus === "error" ? "Snapshot : Error raised here!" : "",
                    variant: operationStatus === "error" ? "error" : undefined
                },
                deviceLoading: operationStatus === "initial" || operationStatus === "loadingDevice"
            },
            snapshot: {
                snapshot: parsedSnapshot,
                snapshotError: {
                    message: operationStatus === "error" ? "Device : Error raised here!" : "",
                    variant: operationStatus === "error" ? "error" : undefined
                },
                operationStatus: operationStatus === "loadingSnapshot" ? "loading" : (operationStatus !== "loadingDevice" ? operationStatus : "loading")
            },
            chatbot:{
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

    test("Before loading", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()
        expect(true).toBe(true)

        // Given
        const store = initStore("initial")

        initUseSelectorMock(store)

        const apolloMocks = initApolloMock("initial")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Loading device", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()
        expect(true).toBe(true)

        // Given
        const store = initStore("loadingDevice")

        initUseSelectorMock(store)

        const apolloMocks = initApolloMock("loading")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Loading snapshot", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()
        expect(true).toBe(true)

        // Given
        const store = initStore("loadingSnapshot")

        initUseSelectorMock(store)

        const apolloMocks = initApolloMock("loading")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("After loading", async () => {
        // Before
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockImplementation(() => {
            return mockedDispatch
        });
        initEnqueueSnackbarMock()
        expect(true).toBe(true)

        const snapshot = new SnapshotData()
        const device = new Device()

        // Given
        const store = initStore("success", snapshot, device)

        initUseSelectorMock(store)

        const apolloMocks = initApolloMock("success")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })
})
