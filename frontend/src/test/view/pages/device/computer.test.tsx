import React from "react"

import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event"
import { waitFor } from "@testing-library/dom"

import { dataManager } from "../../../../main/app/model/AppDataManager"
import { initApolloMock, initEnqueueSnackbarMock, initInitialState, renderMockedComponent, renderWithProviders, rerenderMockedComponent } from "../../utils/utils"

import Device from "../../../../main/app/model/device/device"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import ComputerPage from "../../../../main/app/view/pages/computer/computerPage"
import gqlClient from "../../../../main/app/model/queries/client"

const mockUseParams = jest.fn();

const mockUseQuery = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => mockUseParams()
}));

jest.mock("@apollo/client", ()=>({
    ...jest.requireActual("@apollo/client"),
    useQuery: (...params) => mockUseQuery()
}));

describe("Computer page", () => {
    beforeEach(()=>{
        mockUseParams.mockReturnValue({ id: undefined });
    })

    afterEach(() => {
        dataManager.removeAllData();
        gqlClient.get_query_client().clearStore();
    })
    afterAll(() => {
        jest.restoreAllMocks();
    })

    test.skip("Initial render (loading data)", async () => {
        // Before
        const initialState = initInitialState("loadingDevice", undefined, undefined, undefined);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("loadingDevice", undefined, undefined);

        initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage />, true);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

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

        mockUseQuery.mockImplementation((...params)=>{
            console.log(...params);
        })

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage />, true);

        // Asserts
        expect(asFragment()).toMatchSnapshot();
        expect(document.title).toBe(`Backup - device ${device.name}`);
    })

    test.skip("Switch snapshot should be reflected", async () => {
        // Before
        const firstSnapshot = new SnapshotData("myOS!");
        firstSnapshot.addSoftware("test", "test software", "1.0");
        const firstSnapshotDate = new Date(2020, 0, 1);

        const secondSnapshot = new SnapshotData("myOS!");
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
        const { container, getByText, rerender } = renderMockedComponent(
            store, apolloMocks, <ComputerPage />, true
        );

        // Acts
        const snapshotSelector = container.querySelector('#dataType-select') as HTMLSelectElement;
        userEvent.selectOptions(snapshotSelector, "1");
        mockUseParams.mockReturnValue({ id: '1' });

        const updatedState = initInitialState("success", ["device", "snapshot"], secondSnapshot, device);
        const updatedStore = renderWithProviders(updatedState);

        const updatedApolloMocks = initApolloMock("success", secondSnapshot, device);

        rerenderMockedComponent(rerender, updatedStore, updatedApolloMocks, <ComputerPage />, true);

        // Asserts
        waitFor(() => { expect(getByText("Loading data…")).not.toBeInTheDocument() });
    })

    test.skip("Error render (device unknown)", async () => {
        // Before
        const initialState = initInitialState("deviceError");
        const store = renderWithProviders(initialState);

        // Acts
        const apolloMocks = initApolloMock("deviceError");
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage />, true);;

        // Asserts
        expect(asFragment()).toMatchSnapshot();
        expect(document.title).toBe(`Backup - unknown device`);
    })
})
