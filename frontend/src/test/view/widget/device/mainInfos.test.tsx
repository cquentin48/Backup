import React from "react"

import '@testing-library/jest-dom'

import { MockedResponse, MockedProvider } from "@apollo/client/testing"
import { EnhancedStore, configureStore } from "@reduxjs/toolkit"
import { fireEvent, render, RenderResult } from "@testing-library/react"

import { useSelector, Provider } from "react-redux"

import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import MainInfosFrame from "../../../../main/app/view/pages/computer/mainInfosFrame"

import gqlClient from "../../../../main/app/model/queries/client"

import deviceReducer, { FetchDeviceSliceState } from "../../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import filterReducer, { FilterSliceState } from "../../../../main/app/controller/deviceMainInfos/filterSlice"
import snapshotReducer, { SnapshotSliceState } from "../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError"
import Filter from "../../../../main/app/model/filters/Filter"
import { LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"
import { SnapshotSoftware } from "../../../../main/app/model/snapshot/snapshotLibrary"

import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';
import FETCH_DEVICE from '../../../../main/res/queries/computer_infos.graphql';

import { DeviceInfosQueryResult as FetchDeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos"

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

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

describe("MainInfosFrame unit test suite", () => {
    beforeEach(() => {
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
    */
    const initUseSelectorMock = (operationStatus: "init" | "success" | "failure" | "loading", device: Device | undefined, snapshot: SnapshotData | undefined = undefined, filter: Filter[] = []): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        mockedUseSelector.mockImplementation((selector) =>
            selector(
                {
                    device: {
                        device: device,
                        deviceLoading: operationStatus === "init" || operationStatus === "loading",
                        error: {
                            message: operationStatus === "failure" ? "Error raised in test" : "",
                            variant: operationStatus === "failure" ? "Error raised in test" : undefined
                        }
                    },
                    snapshot: {
                        snapshotError: operationStatus === "failure" ? "Error raised here!" : "",
                        operationStatus,
                        snapshot: operationStatus === "success" ? snapshot : undefined
                    },
                    filter: {
                        filters: filter,
                        selectedFilteredIDS: [],
                        filterError: {
                            message: operationStatus === "failure" ? "Error raised in test" : "",
                            variant: operationStatus === "failure" ? "Error raised in test" : undefined
                        }
                    }
                }
            )
        )
    }

    /**
     * Render the SoftwaresOrigin component with the Apollo query and store mocks
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Fetch snapshot operation stage
     * @param {SnapshotData | undefined} snapshot Provided snapshot for the success fetch snapshot data
     * @param {EnhancedStore} store Redux mocked store
     * @returns {NotFoundError} If the operation is marked as a success and no snapshot is provided.
     */
    const renderMockedComponent = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined, device: Device | undefined, store: EnhancedStore): RenderResult => {
        let apolloMocks: Array<MockedResponse<LoadSnapshotQueryResult | FetchDeviceInfosQueryResult, any>>;
        if (operationStatus === "success") {
            if (snapshot === undefined) {
                throw new NotFoundError("Invalid operation : if the test type is a success, the snapshot must be defined!")
            }
            apolloMocks = [
                {
                    request: {
                        query: FETCH_SNAPSHOT
                    },
                    result: {
                        data: {
                            snapshotInfos: snapshot
                        }
                    }
                },
                {
                    request: {
                        query: FETCH_DEVICE
                    },
                    result: {
                        data: {
                            deviceInfos: device as Device
                        }
                    }
                }
            ]
        } else if (operationStatus === "failure") {
            apolloMocks = [
                {
                    request: {
                        query: FETCH_SNAPSHOT
                    },
                    result: {
                        errors: [
                            {
                                message: "Failure here for the test!"
                            }
                        ]
                    }
                }
            ]
        } else {
            apolloMocks = [
                {
                    request: {
                        query: FETCH_SNAPSHOT
                    },
                    result: {}
                }
            ]
        }
        return render(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <MainInfosFrame />
                </MockedProvider>
            </Provider>
        )
    }

    /**
     * Initialise the test
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Type of operation mocked for the unit test
     * @param {SnapshotData | undefined} snapshot Device snapshot used in the unit test
     * @param {Device |undefined} device device used for the mock
     * @param {Filter[]} filters Filters used in the unit test
     * @returns {EnhancedStore} Mocked store
     * 
     * @throws {Error} If the test stage is not in the list
     */
    const initStore = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined, device: Device | undefined, filter: Filter[] = []): EnhancedStore => {
        let preloadedState: MockedPreloadedState;
        if (snapshot === undefined && operationStatus === "success") {
            throw new Error("The snapshot must be defined if the loading snapshot data with a GraphQL query is successful!")
        }
        preloadedState = {
            snapshot: {
                snapshot,
                snapshotError: "",
                operationStatus: "success"
            },
            device: {
                device: operationStatus === "success" ? device as Device : undefined,
                deviceError: {
                    message: operationStatus === "failure" ? "Error raised in test" : "",
                    variant: undefined
                },
                deviceLoading: operationStatus === "initial" || operationStatus === "loading"
            },
            filter: {
                filters: filter,
                filterError: {
                    message: operationStatus === "failure" ? "Error raised in test" : "",
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
     * Build the apollo query result for the mock
     * @param {SnapshotSoftware[]} softwares softwares set inside a snapshot
     * @returns {{name:string; installType: string; chosenVersion: string}[]} Apollo query result built for the mock.
     */
    const buildQueryResult = (softwares: SnapshotSoftware[]): Array<{ name: string, installType: string, chosenVersion: string }> => {
        const output: Array<{ name: string, installType: string, chosenVersion: string }> = []
        softwares.forEach((software) => {
            output.push({
                name: software.name,
                installType: software.installType,
                chosenVersion: software.version
            })
        })
        return output
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
        renderMockedComponent("success", snapshot, device, store)

        // Acts
        render(
            <MainInfosFrame />
        )
    })

    test.skip("Update selected item", async () => {
        // Given
        const testDevice = new Device(
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

        // Acts
        const { container, getByText } = render(
            <MainInfosFrame />
        )

        const snapshotSelect = container.querySelector(".MuiSelect-nativeInput") as Element
        fireEvent.change(snapshotSelect, { target: { value: testDevice.snapshots[1].key } })

        // Asserts
        expect(getByText(testDevice.snapshots[1].localizedDate())).toBeInTheDocument()
    })
})
