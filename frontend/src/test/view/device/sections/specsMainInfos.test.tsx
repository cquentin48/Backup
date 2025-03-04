import React from "react";

import { render, type RenderResult, waitFor } from "@testing-library/react"

import '@testing-library/jest-dom'

import { Provider, useSelector } from "react-redux";
import { type MockedResponse, MockedProvider, ResultFunction } from "@apollo/client/testing";

import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import { type DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";

import deviceReducer, { type FetchDeviceSliceState } from "../../../../main/app/controller/deviceMainInfos/loadDeviceSlice";
import snapshotReducer, { type SnapshotSliceState } from "../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice";

import SpecsMainInfos from "../../../../main/app/view/pages/computer/sections/MainInfos";

import FETCH_DEVICE from '../../../../main/res/queries/computer_infos.graphql';
import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';
import { type LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";
import { AppState } from "../../../../main/app/controller/store";
import { DocumentNode, FetchResult } from "@apollo/client";
import device from "../../../../main/app/model/device/device";
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError";

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

interface MockedState {
    device: FetchDeviceSliceState
    snapshot: SnapshotSliceState
}

interface ApolloMockResult {
    request: {
        query: DocumentNode;
    };
    result: FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult>, any> | undefined;
}

describe("Device main infos test suite", () => {
    const mockApolloCalls = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined): ApolloMockResult[] => {
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

        } else if (operationStatus === "failure") {
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

    const renderMockedComponent = (store: EnhancedStore<AppState>, operationStatus: "loading" | "success" | "error", apolloMocks: Array<MockedResponse<DeviceInfosQueryResult | LoadSnapshotQueryResult, any>>): RenderResult => {
        return render(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SpecsMainInfos />
                </MockedProvider>
            </Provider>
        )
    }

    const initStore = (operationStatus: "loading" | "success" | "error", device: Device | undefined = undefined, snapshot: SnapshotData | undefined = undefined): EnhancedStore => {
        const preloadedState: MockedState = {
            device: {
                device,
                deviceError: {
                    message: operationStatus === "error" ? "Error raised!" : "",
                    variant: operationStatus === "error" ? "error" : undefined
                },
                deviceLoading: operationStatus === "loading"
            },
            snapshot: {
                operationStatus: operationStatus,
                snapshot,
                snapshotError: operationStatus === "error" ? "Error raised!" : ""
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
     * @param {SnapshotData} snapshot Fetched snapshot from the server.
     * @throws {NotFoundError} If the operation is marked as a success and no device is
     */
    const initUseSelectorMock = (store: EnhancedStore<AppState>): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        mockedUseSelector.mockImplementation((selector) => {
            const deviceState = store.getState().device
            const snapshotState = store.getState().snapshot

            return selector(
                {
                    device: {
                        device: deviceState.device,
                        error: deviceState.deviceError !== undefined ? {
                            message: deviceState.deviceError.message,
                            variant: deviceState.deviceError?.variant
                        } : undefined,
                        deviceLoading: deviceState.deviceLoading
                    },
                    snapshot: {
                        operationStatus: snapshotState.operationStatus,
                        snapshot: snapshotState.snapshot,
                        snapshotError: snapshotState.snapshotError
                    }
                }
            )
        }
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
        snapshot.addSoftware("test", "test software", "1.0")

        const apolloMocks = mockApolloCalls("success", snapshot, device)

        const store = initStore("success", device, snapshot)
        initUseSelectorMock(store)

        // Acts

        const { asFragment } = renderMockedComponent(store, "success", apolloMocks)

        // Assert
        expect(asFragment()).toMatchSnapshot()
    })

    test("Loading specs main infos (error)", async () => {
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

        const store = initStore("error")
        initUseSelectorMock(store)

        const apolloMocks = mockApolloCalls("failure", snapshot, device)

        // Acts
        const { asFragment } = renderMockedComponent(store, "error", apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Loading specs main infos (loading)", async () => {
        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        const store = initStore("loading")
        initUseSelectorMock(store)

        const apolloMocks = mockApolloCalls("loading")

        // Acts
        const { asFragment } = renderMockedComponent(store, "loading", apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })
})
