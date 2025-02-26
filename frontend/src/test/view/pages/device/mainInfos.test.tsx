import React from 'react';

import { MockedResponse, MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom'
import { render, screen, fireEvent, RenderResult } from '@testing-library/react';

import DeviceMainInfos from '../../../../main/app/view/pages/computer/mainInfos';
import Device from '../../../../main/app/model/device/device';
import SnapshotID from '../../../../main/app/model/device/snapshotId';

import { Provider, useSelector } from 'react-redux';
import store from '../../../../main/app/controller/store';

import { DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";

import deviceReducer, { FetchDeviceSliceState } from "../../../../main/app/controller/deviceMainInfos/loadDeviceSlice";
import snapshotReducer, { SnapshotSliceState } from "../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice";

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
    device: FetchDeviceSliceState;
    snapshot: SnapshotSliceState;
}

describe("Device main Infos unit test suite", () => {
    const renderMockedComponent = (device: Device, store: EnhancedStore, snapshot: SnapshotData): RenderResult => {
        let apolloMocks: Array<MockedResponse<DeviceInfosQueryResult | LoadSnapshotQueryResult, any>> = [
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
                    <DeviceMainInfos />
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
    
    afterEach(() => {
        jest.resetAllMocks()
    })

    test("Successful render (non Ubuntu OS)", async () => {
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
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock(device, snapshot)
        const store = initStore(device, snapshot)

        // Acts
        const { container } = renderMockedComponent(device, store, snapshot)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(device.snapshots[0].operatingSystem))

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(device.name)
        expect(renderedDeviceHeaderButton).not.toBeNull()
        expect(renderedDeviceHeaderButton).toHaveTextContent("Delete device")
    })

    test("Successful render Ubuntu OS", async () => {
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

        initUseSelectorMock(device, snapshot)
        const store = initStore(device, snapshot)

        // Acts
        const { container } = renderMockedComponent(device, store, snapshot)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(device.snapshots[0].operatingSystem))

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(device.name)
        expect(renderedDeviceHeaderButton).not.toBeNull()
        expect(renderedDeviceHeaderButton).toHaveTextContent("Delete device")
    })
})
