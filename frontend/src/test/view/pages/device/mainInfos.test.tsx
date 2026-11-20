import React from 'react';

import '@testing-library/jest-dom'
import { fireEvent } from '@testing-library/react';

import { Provider } from 'react-redux';

import DeviceMainInfos from '../../../../main/app/view/pages/computer/mainInfos';
import Device from '../../../../main/app/model/device/device';
import SnapshotID from '../../../../main/app/model/device/snapshotId';
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";

import { initApolloMock, initInitialState, renderMockedComponent, renderWithProviders } from '../../utils/utils';

describe("Device main Infos unit test suite", () => {
    afterEach(() => {
        jest.resetAllMocks()
    })

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

        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("loadingDevice", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(
            store, apolloMocks, <DeviceMainInfos currentSnapshotID='1'/>
        );

        // Asserts
        expect(asFragment()).toMatchSnapshot();
    });

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
        );

        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment, getByText } = renderMockedComponent(
            store, apolloMocks, <DeviceMainInfos currentSnapshotID='1'/>
        );

        // Asserts

        expect(getByText(device.name)).toBeInTheDocument()
        expect(getByText(device.processor)).toBeInTheDocument()
        expect(asFragment()).toMatchSnapshot()
    });

    test("Failure in rendering : error", async () => {
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
        );

        const snapshot = new SnapshotData();

        const initialState = initInitialState("deviceError", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("deviceError", undefined, device);

        // Acts
        const { asFragment, getAllByText } = renderMockedComponent(
            store, apolloMocks, <DeviceMainInfos currentSnapshotID='1'/>
        );

        // Asserts
        const errorText = getAllByText("Error in loading data")[0];
        expect(errorText).toBeInTheDocument()
        expect(asFragment()).toMatchSnapshot()
    });

    test("Tooltip displayed (non Ubuntu OS device)", () => {
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
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { container, getByText } = renderMockedComponent(
            store, apolloMocks, <DeviceMainInfos currentSnapshotID='1'/>
        );
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")

        const osIcon = (getByText(device.name).parentNode as HTMLElement).querySelector("svg") as Element

        fireEvent.mouseOver(osIcon)

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(device.name)
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

        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { container } = renderMockedComponent(
            store, apolloMocks, <DeviceMainInfos currentSnapshotID='1'/>
        );
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader") as HTMLDivElement;

        fireEvent.mouseOver(renderedDeviceHeader);

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(device.name)
    })
})
