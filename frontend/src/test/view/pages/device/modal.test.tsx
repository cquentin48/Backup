import React from "react";

import Device from "../../../../main/app/model/device/device";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";

import LoadingDeviceModal from "../../../../main/app/view/pages/computer/DeviceModal";
import SnapshotID from "../../../../main/app/model/device/snapshotId";
import { initInitialState, renderWithProviders, initApolloMock, renderMockedComponent } from "../../utils/utils";

describe("Device loading modal test suite snapshot", () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("Loading device", async () => {
        // Given
        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("loadingDevice", []);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("loadingDevice");

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <LoadingDeviceModal />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    });

    test("Loading snapshot", async () => {
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

        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("loadingSnapshot", ["device"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("loadingSnapshot", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <LoadingDeviceModal />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("After loading", async () => {

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

        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", snapshot, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <LoadingDeviceModal />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })
})

