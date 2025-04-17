import React, { type ReactNode } from "react"

import '@testing-library/jest-dom'

import { MockedProvider, type ResultFunction } from "@apollo/client/testing"
import { type FetchResult } from "@apollo/client"
import { type DataGridProps } from "@mui/x-data-grid"
import { type EnhancedStore, configureStore } from "@reduxjs/toolkit"
import { fireEvent, render, waitFor, type RenderResult } from "@testing-library/react"
import { SnackbarProvider, useSnackbar } from "notistack"
import { useSelector, Provider, useDispatch } from "react-redux"

import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import MainInfosFrame from "../../../../main/app/view/pages/computer/mainInfosFrame"

import gqlClient from "../../../../main/app/model/queries/client"

import deviceReducer, { type FetchDeviceSliceState } from "../../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import filterReducer, { type FilterSliceState } from "../../../../main/app/controller/deviceMainInfos/filterSlice"
import snapshotReducer, { type SnapshotSliceState } from "../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError"
import type Filter from "../../../../main/app/model/filters/Filter"
import { type LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"

import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';
import FETCH_DEVICE from '../../../../main/res/queries/computer_infos.graphql';

import { type DeviceInfosQueryResult as FetchDeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos"
import { type AppState } from "../../../../main/app/controller/store"

/**
 * Preloaded state used for the mocks in the tests
 */
interface MockedPreloadedState {
    /**
     * Snapshot defined in the snapshot slice
     */
    snapshot: SnapshotSliceState

    /**
     * Device state defined in the device slice
     */
    device: FetchDeviceSliceState

    /**
     * Filter state define in the filter slice
     */
    filter: FilterSliceState
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
    return async ({ children }: { children: ReactNode }) => await children;
});

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

jest.mock("notistack", () => {
    const actual = jest.requireActual("notistack");
    return {
        ...actual,
        useSnackbar: jest.fn()
    };
});

describe("MainInfosFrame unit test suite", () => {
    beforeEach(() => {
        gqlClient.get_query_client().query = initGraphQLMock()
        const mockedDispatch = jest.fn();
        (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockedDispatch);
        initEnqueueSnackbarMock()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const initEnqueueSnackbarMock = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        return mockEnqueueSnackbar
    }

    /**
     * Init the ``useSelector`` mock for the unit test
     * @param {"init" | "success" | "failure" | "loading"} operationStatus Mocked operation status in the test
     * @param {Device} device Device used for the mock used in a test
     * @param {SnapshotData} snapshot Snapshot used for the test
     * @param {Filter[]} filters Filter(s) used for the test
     */
    const initUseSelectorMock = (operationStatus: "initial" | "success" | "deviceError" | "snapshotError" | "loading", device: Device | undefined, snapshot: SnapshotData | undefined = undefined, filters: Filter[] = []): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        mockedUseSelector.mockImplementation((selector: (state: AppState) => unknown) =>
            selector(
                {
                    device: {
                        device,
                        deviceLoading: operationStatus === "initial" || operationStatus === "loading",
                        deviceError: {
                            message: operationStatus === "deviceError" ? "Device error raised in test" : "",
                            variant: operationStatus === "deviceError" ? "error" : undefined
                        }
                    },
                    snapshot: {
                        snapshotError: {
                            message: operationStatus === "snapshotError" ? "Snapshot error raised here!" : "",
                            variant: operationStatus === "snapshotError" ? "error" : undefined
                        },
                        operationStatus: operationStatus === "snapshotError" ? "error" : (operationStatus !== "deviceError" ? operationStatus : "initial"),
                        snapshot: operationStatus === "success" ? snapshot : undefined
                    },
                    filter: {
                        filters,
                        selectedFilteredIDS: [],
                        filterError: {
                            message: operationStatus === "deviceError" || operationStatus === "snapshotError" ? "Error raised in test" : "",
                            variant: operationStatus === "deviceError" || operationStatus === "snapshotError" ? "error" : undefined
                        }
                    },
                    chatbot:{
                        conversationHeaders: [],
                        messages: []
                    }
                }
            )
        )
    }

    /**
     * Render the SoftwaresOrigin component with the Apollo query and store mocks
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Fetch snapshot operation stage
     * @param {SnapshotData | undefined} snapshot Provided snapshot for the success fetch snapshot data
     * @param {Device | undefined} device Preloaded device
     * @param {EnhancedStore} store Redux mocked store
     * @returns {NotFoundError} If the operation is marked as a success and no snapshot is provided.
     */
    const renderMockedComponent = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined, device: Device | undefined, store: EnhancedStore): RenderResult => {

        let deviceResult: FetchResult<FetchDeviceInfosQueryResult> | ResultFunction<FetchResult<FetchDeviceInfosQueryResult>, any> | undefined;

        let snapshotResult: FetchResult<LoadSnapshotQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult>, any> | undefined;

        if (operationStatus === "success") {
            if (snapshot === undefined && operationStatus !== "success") {
                throw new NotFoundError("Invalid operation : if the test type is a success, the snapshot must be defined!")
            }
            deviceResult = {
                data: {
                    deviceInfos: device as Device
                }
            }
            snapshotResult = {
                data: {
                    snapshotInfos: snapshot as SnapshotData
                }
            }

        } else if (operationStatus === "failure") {
            const errorMessage = "Raised error message here!"
            deviceResult = {
                errors: [
                    {
                        message: errorMessage
                    }
                ]
            }
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
            },
            {
                request: {
                    query: FETCH_DEVICE
                },
                result: deviceResult
            }
        ]
        jest.fn().mockImplementation(async ({ query }) => {
            if (query === FETCH_SNAPSHOT) {
                return await Promise.resolve(
                    {
                        result: {
                            data: {
                                snapshotInfos: snapshot as SnapshotData
                            }
                        }
                    }
                )
            } else if (query === FETCH_DEVICE) {
                return await Promise.resolve(
                    {
                        result: {
                            data: {
                                deviceInfos: device as Device
                            }
                        }
                    }
                )
            }
        })

        gqlClient.get_query_client().query = jest.fn().mockImplementation(async ({ query }) => {
            if (query === FETCH_SNAPSHOT) {
                return await Promise.resolve(
                    snapshotResult
                )
            } else if (query === FETCH_DEVICE) {
                return await Promise.resolve(
                    deviceResult
                )
            }
        })

        return render(
            <Provider store={store}>
                <SnackbarProvider>
                    <MockedProvider mocks={apolloMocks} addTypename={false}>
                        <MainInfosFrame />
                    </MockedProvider>
                </SnackbarProvider>
            </Provider>
        )
    }

    /**
     * Initialise the test
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Type of operation mocked for the unit test
     * @param {SnapshotData | undefined} snapshot Device snapshot used in the unit test
     * @param {Device |undefined} device device used for the mock
     * @param {Filter[]} filter Filters used in the unit test
     * @returns {EnhancedStore} Mocked store
     * @throws {Error} If the test stage is not in the list
     */
    const initStore = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined, device: Device | undefined, filter: Filter[] = []): EnhancedStore => {
        if (snapshot === undefined && operationStatus === "success") {
            throw new Error("The snapshot must be defined if the loading snapshot data with a GraphQL query is successful!")
        }
        const preloadedState: MockedPreloadedState = {
            snapshot: {
                snapshot,
                snapshotError: {
                    message: "",
                    variant: undefined
                },
                operationStatus: "success"
            },
            device: {
                device: operationStatus === "success" ? device as Device : undefined,
                deviceError: {
                    message: operationStatus === "failure" ? "Device error raised in test" : "",
                    variant: operationStatus === "failure" ? "error" : undefined
                },
                deviceLoading: operationStatus === "initial" || operationStatus === "loading"
            },
            filter: {
                filters: filter,
                filterError: {
                    message: operationStatus === "failure" ? "Snaphsot error raised in test" : "",
                    variant: undefined
                },
                selectedFilteredIDS: []
            }
        }
        return configureStore({
            reducer: {
                snapshot: snapshotReducer,
                device: deviceReducer,
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
        const deviceQueryOutput = {
            data: {
                deviceInfos: {
                    cores: 4,
                    memory: 16,
                    name: "My PC!",
                    operatingSystem: "OS",
                    processor: "My processor name",
                    snapshots: [
                        {
                            snapshotId: "1",
                            snapshotDate: "2020-01-01"
                        }
                    ]
                }
            }
        }
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
        return jest.fn().mockImplementation(async ({ query }) => {
            if (query === FETCH_SNAPSHOT) {
                return await Promise.resolve(
                    snapshotQueryOutput
                )
            } else if (query === FETCH_DEVICE) {
                return await Promise.resolve(
                    deviceQueryOutput
                )
            }
        })
    }

    test("Pending render", async () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        )
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock("loading", device, snapshot)
        const store = initStore("loading", snapshot, device)

        // Acts
        const { asFragment } = renderMockedComponent("loading", snapshot, device, store)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render", async () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        )
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock("success", device, snapshot)
        const store = initStore("success", snapshot, device)

        // Acts
        const { asFragment } = renderMockedComponent("success", snapshot, device, store)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Device error render", async () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        )
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock("deviceError", device, snapshot)
        const store = initStore("failure", snapshot, device)
        const enqueueSnackbar = initEnqueueSnackbarMock()

        // Acts
        const { asFragment } = renderMockedComponent("failure", snapshot, device, store)

        // Asserts
        expect(enqueueSnackbar).toHaveBeenCalled()
        expect(asFragment()).toMatchSnapshot()
    })

    test("Snapshot error render", async () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        )
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock("snapshotError", device, snapshot)
        const store = initStore("failure", snapshot, device)
        const enqueueSnackbar = initEnqueueSnackbarMock()

        // Acts
        const { asFragment } = renderMockedComponent("failure", snapshot, device, store)

        // Asserts
        expect(enqueueSnackbar).toHaveBeenCalled()
        expect(asFragment()).toMatchSnapshot()
    })

    test("Update selected item", async () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [
                new SnapshotID(
                    "1",
                    "2020-01-01",
                    "My OS!"
                ),
                new SnapshotID(
                    "2",
                    "2020-01-02",
                    "My OS!"
                )
            ]
        )
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock("success", device, snapshot)
        const store = initStore("success", snapshot, device)

        // Acts
        const { container, getByText } = renderMockedComponent("success", snapshot, device, store)

        const snapshotSelect = container.querySelector(".MuiSelect-nativeInput") as Element
        fireEvent.change(snapshotSelect, { target: { value: device.snapshots[1].key } })

        // Asserts
        await waitFor(() => {
            expect(getByText(SnapshotID.localizedDate(device.snapshots[1].date))).toBeInTheDocument()
        }, { timeout: 500 })
    })
})
