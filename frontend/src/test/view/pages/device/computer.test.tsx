import React from "react"

import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event"
import { fireEvent, waitFor } from "@testing-library/dom"

import { dataManager } from "../../../../main/app/model/AppDataManager"
import { initApolloMock, initEnqueueSnackbarMock, initInitialState, renderMockedComponent, renderWithProviders, rerenderMockedComponent } from "../../utils/utils"

import Device from "../../../../main/app/model/device/device"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import ComputerPage from "../../../../main/app/view/pages/computer/computerPage"
import { executeQuery } from "../../../../main/app/model/queries/client"
import { DocumentNode } from "@apollo/client"
import BasicQueryParameters from "../../../../main/app/model/queries/basicQueryParameters"
import { LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot"
import { DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos"

const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => mockUseParams()
}));

jest.mock("../../../../main/app/model/queries/client", () => ({
    ...jest.requireActual("../../../../main/app/model/queries/client"),
    executeQuery: jest.fn()
}));

describe("Computer page", () => {
    beforeEach(() => {
        mockUseParams.mockReturnValue({ id: undefined });
    });

    afterEach(() => {
        dataManager.removeAllData();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    const updateMockExecuteQuery = (device: Device, snapshot: SnapshotData) => {
        (executeQuery as jest.Mock).mockImplementation((query: DocumentNode, variables?: BasicQueryParameters) => {
            if (query.definitions[0]["name"].value === "getSaveInfos") {
                return {
                    snapshotInfos: snapshot
                } as LoadSnapshotQueryResult
            }
            if (query.definitions[0]["name"].value === "getDeviceInfos") {
                return {
                    deviceInfos: device
                } as DeviceInfosQueryResult
            }
        });
    };

    test("Initial render (loading data)", async () => {
        // Before
        const initialState = initInitialState("loadingDevice", undefined, undefined, undefined);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("loadingDevice", undefined, undefined);

        initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage />, true);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    });

    test("Successful render", async () => {
        // Before
        const snapshot = new SnapshotData("myOS!");
        snapshot.addSoftware("test", "test software", "1.0");

        const currentDate = new Date(2020, 1, 1);
        const device = new Device("mydevice", "myprocessor", 4, 17179869184, [new SnapshotID("0", currentDate.toDateString(), "myOS")]);

        initEnqueueSnackbarMock();
        mockUseParams.mockReturnValue({ id: '0' });

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);

        const apolloMocks = initApolloMock("success", snapshot, device);
        updateMockExecuteQuery(device, snapshot);

        // Acts
        const { asFragment, getByText } = renderMockedComponent(store, apolloMocks, <ComputerPage />, true);

        await waitFor(() => expect(getByText(device.name)).toBeInTheDocument());

        // Asserts
        expect(document.title).toBe(`Backup - device ${device.name}`);
        expect(asFragment()).toMatchSnapshot();
    });



    test("Page with id changed should update", async () => {
        // Before
        const snapshot = new SnapshotData("myOS!");
        snapshot.addSoftware("test", "test software", "1.0");

        const currentDate = new Date(2020, 1, 1);
        const device = new Device("mydevice", "myprocessor", 4, 17179869184, [new SnapshotID("0", currentDate.toDateString(), "myOS")]);

        initEnqueueSnackbarMock();
        mockUseParams.mockReturnValue({ id: '0' });

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);

        const apolloMocks = initApolloMock("success", snapshot, device);
        updateMockExecuteQuery(device, snapshot);

        // Acts
        const { asFragment, getByText, rerender } = renderMockedComponent(
            store, apolloMocks, <ComputerPage />, true
        );
        mockUseParams.mockReturnValue({ id: '1' });

        const newDevice = new Device("my new device!", "myprocessor", 4, 17179869184, [new SnapshotID("0", currentDate.toDateString(), "myOS")]);
        const updatedState = initInitialState("success", ["device", "snapshot"], snapshot, newDevice);
        const newStore = renderWithProviders(updatedState);

        const newApolloMocks = initApolloMock("success", snapshot, newDevice);
        updateMockExecuteQuery(device, snapshot);

        rerenderMockedComponent(rerender, newStore, newApolloMocks, <ComputerPage/>, true);

        // Asserts
        expect(document.title).toBe(`Backup - device ${newDevice.name}`);
        expect(asFragment()).toMatchSnapshot();
    });

    test("Switch snapshot should be reflected", async () => {
        // Before
        const firstSnapshot = new SnapshotData("myOS!");
        firstSnapshot.addSoftware("test", "test software", "1.0");
        const firstSnapshotDate = new Date(2020, 0, 1);

        const secondSnapshot = new SnapshotData("mysecondOS!");
        secondSnapshot.addSoftware("test", "test software", "1.0");
        const secondSnapshotDate = new Date(2020, 1, 1);

        const snapshotIDs = [
            new SnapshotID("0", firstSnapshotDate.toDateString(), firstSnapshot.operatingSystem),
            new SnapshotID("1", secondSnapshotDate.toDateString(), secondSnapshot.operatingSystem),
        ];

        const device = new Device("mydevice", "myprocessor", 4, 17179869184, snapshotIDs);

        initEnqueueSnackbarMock();

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], firstSnapshot, device);
        const store = renderWithProviders(initialState);

        const apolloMocks = initApolloMock("success", [firstSnapshot, secondSnapshot], device);
        const { asFragment, container, rerender } = renderMockedComponent(
            store, apolloMocks, <ComputerPage />, true
        );

        // Acts
        updateMockExecuteQuery(device, secondSnapshot);
        const snapshotSelector = container.querySelector('#dataType-select') as HTMLSelectElement;
        userEvent.selectOptions(snapshotSelector, "1");
        mockUseParams.mockReturnValue({ id: '1' });

        const updatedState = initInitialState("success", ["device", "snapshot"], secondSnapshot, device);
        const updatedStore = renderWithProviders(updatedState);

        const updatedApolloMocks = initApolloMock("success", secondSnapshot, device);

        rerenderMockedComponent(rerender, updatedStore, updatedApolloMocks, <ComputerPage />, true);

        // Asserts
        const selectDOMElement: HTMLSelectElement = container.querySelector('#dataType-select')!;
        const selectedIndex = selectDOMElement.value;
        const selectedElement = selectDOMElement.querySelector(`option[value="${selectedIndex}"]`);

        const value = selectedElement!.innerHTML;

        expect(value).toBe(SnapshotID.localizedDate(secondSnapshotDate));

        const osIcon = container.querySelector("#DeviceMainInfosOSIcon") as SVGElement;

        fireEvent.mouseOver(osIcon);
        const foundValue = container.querySelector("#OSIcon")!.querySelector("p")!.innerHTML;

        expect(foundValue).toBe(secondSnapshot.operatingSystem);
        expect(asFragment()).toMatchSnapshot();
    });

    test("Error render (device unknown)", async () => {
        // Before
        const initialState = initInitialState("deviceError");
        const store = renderWithProviders(initialState);

        // Acts
        const apolloMocks = initApolloMock("deviceError");
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage />, true);;

        // Asserts
        expect(asFragment()).toMatchSnapshot();
        expect(document.title).toBe(`Backup - unknown device`);
    });
});
