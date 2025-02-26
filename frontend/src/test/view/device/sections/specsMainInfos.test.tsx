import React from "react";

import { render, RenderResult, waitFor } from "@testing-library/react"

import '@testing-library/jest-dom'

import { Provider, useSelector } from "react-redux";
import { MockedResponse, MockedProvider } from "@apollo/client/testing";

import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import { DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import deviceReducer, { FetchDeviceSliceInitialState } from "../../../../main/app/view/controller/deviceMainInfos/loadDeviceSlice";
import snapshotReducer, { SnapshotSliceState } from "../../../../main/app/view/controller/deviceMainInfos/loadSnapshotSlice";

import SpecsMainInfos from "../../../../main/app/view/pages/computer/sections/MainInfos";

import FETCH_DEVICE from '../../../../main/res/queries/computer_infos.graphql';
import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';
import { LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

interface MockedState {
    device: FetchDeviceSliceInitialState;
    snapshot: SnapshotSliceState;
}

describe("Device main infos test suite", () => {
    const renderMockedComponent = (device: Device, store: EnhancedStore, snapshot: SnapshotData): RenderResult => {
        let apolloMocks: Array<MockedResponse<DeviceInfosQueryResult|LoadSnapshotQueryResult, any>> = [
            {
                request: {
                    query: FETCH_DEVICE
                },
                result: {
                    data: {
                        deviceInfos: device
                    }
                }
            },
            {
                request: {
                    query: FETCH_SNAPSHOT
                },
                result: {
                    data: {
                        snapshotInfos: snapshot
                    }
                }
            }
        ]
        return render(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SpecsMainInfos />
                </MockedProvider>
            </Provider>
        )
    }

    const initStore = (device: Device, snapshot: SnapshotData): EnhancedStore => {
        let preloadedState: MockedState = {
            device: {
                device,
                deviceError: {
                    message: "",
                    variant: undefined
                },
                deviceLoading: false
            },
            snapshot: {
                operationStatus: "success",
                snapshot: snapshot,
                snapshotError: ""
            }
        };

        return configureStore({
            reducer: {
                device: deviceReducer,
                snapshot: snapshotReducer
            },
            preloadedState
        })
    }

    /**
     * Init the ``useSelector`` Mock for the unit test
     * @param {"init" | "success" | "failure"| "loading"} operationStatus Device informations fetch operation status
     * @param {Device|undefined} device Device fetched from the server. If successful, must be loaded, otherwise could be left blank.
     * 
     * @throws {NotFoundError} If the operation is marked as a success and no device is
     */
    const initUseSelectorMock = (device: Device, snapshot: SnapshotData): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;

        mockedUseSelector.mockImplementation((selector) =>
            selector(
                {
                    device: {
                        device: device,
                        error: {
                            message: "",
                            variant: undefined
                        },
                        deviceLoading: false
                    },
                    snapshot: {
                        operationStatus: "success",
                        snapshot: snapshot,
                        snapshotError: ""
                    }
                }
            )
        )
    }

    test("Successful render with custom data", async () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "My OS!"
            )]
        )

        const snapshot = new SnapshotData()
        snapshot.addSoftware("test","test software", "1.0")

        initUseSelectorMock(device, snapshot)
        const store = initStore(device, snapshot)

        // Acts
        const { getByText } = renderMockedComponent(device, store, snapshot)

        const expectedOutputValues = [
            device.processor,
            device.cores.toString(),
            device.formatBytes(device.memory),
            (device.snapshots[0]).localizedDate(),
            (device.snapshots[0]).localizedDate(),
            "Amount of storage here used in the backup server"
        ]

        // Assert
        await waitFor(() => {
            const opResult = getByText("Processor")
            let deviceSpecsContainer = opResult.parentElement as HTMLElement

            while (deviceSpecsContainer.id !== "deviceMainInfosSpecs") {
                deviceSpecsContainer = deviceSpecsContainer.parentElement as HTMLElement
            }

            expectedOutputValues.forEach(async (expectedOutput: string, index: number) => {
                const cardValue = deviceSpecsContainer.children[index].children[0].children[1]
                expect(cardValue).toHaveTextContent(expectedOutput)
            })
        }, { timeout: 2500 })
    })
})
