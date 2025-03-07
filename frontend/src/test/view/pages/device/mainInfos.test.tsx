import React, { ReactNode } from 'react';

import { type MockedResponse, MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom'
import { DataGridProps } from '@mui/x-data-grid';
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { render, screen, fireEvent, type RenderResult, waitFor } from '@testing-library/react';

import { Provider, useSelector } from 'react-redux';

import DeviceMainInfos from '../../../../main/app/view/pages/computer/mainInfos';
import Device from '../../../../main/app/model/device/device';
import SnapshotID from '../../../../main/app/model/device/snapshotId';
import { type LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";

import { type DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos";

import deviceReducer, { type FetchDeviceSliceState } from "../../../../main/app/controller/deviceMainInfos/loadDeviceSlice";
import snapshotReducer, { type SnapshotSliceState } from "../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice";

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

interface MockedState {
    device: FetchDeviceSliceState
    snapshot: SnapshotSliceState
}

describe("Device main Infos unit test suite", () => {
    afterEach(() => {
        jest.resetAllMocks()
    })

    const renderMockedComponent = (device: Device, store: EnhancedStore, snapshot: SnapshotData): RenderResult => {
        const apolloMocks: Array<MockedResponse<DeviceInfosQueryResult | LoadSnapshotQueryResult, any>> = [
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

    const initStore = (operationStatus: "initial" | "loading" | "success" | "error", device: Device, snapshot: SnapshotData): EnhancedStore => {
        const preloadedState: MockedState = {
            device: {
                device: operationStatus === "success" ? device : undefined,
                deviceError: {
                    message: operationStatus === "error" ? "Error" : "",
                    variant: operationStatus === "error" ? "error" : undefined
                },
                deviceLoading: operationStatus === "initial" || operationStatus === "loading"
            },
            snapshot: {
                operationStatus: operationStatus,
                snapshot: operationStatus === "success" ? snapshot : undefined,
                snapshotError: {
                    message: operationStatus === "error" ? "Error" : "",
                    variant: operationStatus === "error" ? "error" : undefined,
                }
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
     * @param {Device|undefined} device Device fetched from the server. If successful, must be loaded, otherwise could be left blank.
     * @param {SnapshotData} snapshot Preloaded snapshot before the test
     * @throws {NotFoundError} If the operation is marked as a success and no device is.
     */
    const initUseSelectorMock = (operationStatus: "initial" | "loading" | "success" | "error", device: Device, snapshot: SnapshotData): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;

        mockedUseSelector.mockImplementation((selector) =>
            selector(
                {
                    device: {
                        device: operationStatus === "success" ? device : undefined,
                        error: operationStatus === "error" ? {
                            message: operationStatus === "error" ? "Error" : "",
                            variant: operationStatus === "error" ? "error" : undefined
                        } : undefined,
                        deviceLoading: operationStatus === "initial" || operationStatus === "loading"
                    },
                    snapshot: {
                        operationStatus: operationStatus,
                        snapshot: operationStatus === "success" ? snapshot : undefined,
                        snapshotError: operationStatus === "error" ? "Error" : ""
                    }
                }
            )
        )
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
                "My OS!"
            )]
        )

        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock("loading", device, snapshot)
        const store = initStore("loading", device, snapshot)

        // Acts
        const { asFragment } = renderMockedComponent(device, store, snapshot)

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
                "My OS!"
            )]
        )

        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        initUseSelectorMock("success", device, snapshot)
        const store = initStore("success", device, snapshot)

        // Acts
        const { asFragment } = renderMockedComponent(device, store, snapshot)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Tooltip displayed (non Ubuntu OS device)", async () => {
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

        initUseSelectorMock("success", device, snapshot)
        const store = initStore("success", device, snapshot)

        // Acts
        const { container, getByText } = renderMockedComponent(device, store, snapshot)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")

        const osIcon = (getByText(device.name).parentNode as HTMLElement).querySelector("svg") as Element

        fireEvent.mouseOver(osIcon)

        // Asserts
        await waitFor(() => {
            expect(renderedDeviceHeader).toHaveTextContent(device.name)
        })
    })

    test("Tooltip displayed (Ubuntu OS device)", async () => {
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
        const store = initStore("success", device, snapshot)

        // Acts
        const { container } = renderMockedComponent(device, store, snapshot)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")

        fireEvent.mouseOver(screen.getByLabelText(device.snapshots[0].operatingSystem))

        // Asserts
        await waitFor(() => {
            expect(renderedDeviceHeader).toHaveTextContent(device.name)
        })
    })
})
