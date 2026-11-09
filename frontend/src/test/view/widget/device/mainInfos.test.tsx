import React from "react"

import '@testing-library/jest-dom'
import { fireEvent } from "@testing-library/react"
import { useSnackbar } from "notistack"

import { initInitialState, renderWithProviders, initApolloMock, renderMockedComponent, initEnqueueSnackbarMock } from "../../utils/utils"

import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import MainInfosFrame from "../../../../main/app/view/pages/computer/mainInfosFrame"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"

describe("MainInfosFrame unit test suite", () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("Pending render", async () => {
        // Given
        const initialState = initInitialState("loadingDevice", undefined, undefined, undefined);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("loadingDevice", undefined, undefined);

        initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <MainInfosFrame />, false);

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
        );
        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks,
            <MainInfosFrame />);

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
        const snapshot = new SnapshotData();
        const enqueueSnackbar = initEnqueueSnackbarMock();

        const initialState = initInitialState("deviceError", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("deviceError", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <MainInfosFrame />);

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
        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("snapshotError", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("snapshotError", undefined, device);

        const enqueueSnackbar = initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <MainInfosFrame />);

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

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { container, getByText } = renderMockedComponent(store, apolloMocks,
            <MainInfosFrame />);

        const snapshotSelect = container.querySelector("#dataType-select")
        fireEvent.change(snapshotSelect!, { target: { value: device.snapshots[1].key } })

        // Asserts
        expect(getByText(SnapshotID.localizedDate(device.snapshots[1].date))).toBeInTheDocument()
    })
})