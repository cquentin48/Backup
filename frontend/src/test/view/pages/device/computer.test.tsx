import React from "react"

import { MockedProvider } from "@apollo/client/testing"
import { type EnhancedStore } from "@reduxjs/toolkit"
import '@testing-library/jest-dom'
import { render, type RenderResult } from "@testing-library/react"

import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { useSnackbar } from "notistack"

import { dataManager } from "../../../../main/app/model/AppDataManager"
import { ApolloMockResult, initApolloMock, initInitialState, renderMockedComponent, renderWithProviders, rerenderMockedComponent } from "../../utils/utils"

import Device from "../../../../main/app/model/device/device"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import ComputerPage from "../../../../main/app/view/pages/computer/computerPage"

describe("Computer page", () => {
    afterEach(() => {
        dataManager.removeAllData()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    /**
     * Mock ``enqueueSnackbar`` function
     * @returns {jest.Mock} Mocked ``enqueueSnackbar`` function
     */
    const initEnqueueSnackbarMock = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn((message: string, variants) => "");
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        return mockEnqueueSnackbar
    }

    test("Initial render (loading data)", async () => {
        // Before
        const initialState = initInitialState("loadingDevice", undefined, undefined, undefined);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, undefined);

        initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage/>);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render", async () => {
        // Before
        const snapshot = new SnapshotData("myOS!");
        snapshot.addSoftware("test", "test software", "1.0");

        const currentDate = new Date(2020,1,1);
        const device = new Device("mydevice", "myprocessor", 4, 17179869184, [new SnapshotID("0", currentDate.toDateString(), "myOS")]);

        initEnqueueSnackbarMock();

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);

        const apolloMocks = initApolloMock("success", snapshot, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage/>);

        // Asserts
        expect(asFragment()).toMatchSnapshot();
        expect(document.title).toBe(`Backup - device ${device.name}`);
    })

    test("Switch snapshot should be reflected", async () => {
        // Before
        const firstSnapshot = new SnapshotData("myOS!");
        firstSnapshot.addSoftware("test", "test software", "1.0");
        const firstSnapshotDate = new Date(2020,1,1);

        const secondSnapshot = new SnapshotData("myOS!");
        secondSnapshot.addSoftware("test", "test software", "1.0");
        const secondSnapshotDate = new Date(2020,1,1);

        const snapshotIDs = [
            new SnapshotID("0", firstSnapshotDate.toDateString(), firstSnapshot.operatingSystem),
            new SnapshotID("1", secondSnapshotDate.toDateString(), secondSnapshot.operatingSystem),
        ];

        const device = new Device("mydevice", "myprocessor", 4, 17179869184, snapshotIDs);

        initEnqueueSnackbarMock();

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], firstSnapshot, device);
        const store = renderWithProviders(initialState);

        const apolloMocks = initApolloMock("success", firstSnapshot, device);

        // Acts
        const { asFragment, rerender } = renderMockedComponent(store, apolloMocks, <ComputerPage/>);

        // Asserts
        const newApolloMocks = initApolloMock("success", secondSnapshot, device);
        const updatedState = initInitialState("success", ["device", "snapshot"], secondSnapshot, device);
        const updatedStore = renderWithProviders(updatedState);
        rerenderMockedComponent(rerender, updatedStore, newApolloMocks, <ComputerPage/>);

        console.log("ok");
    })

    test("Error render (device unknown)", async () => {
        // Before
        const initialState = initInitialState("deviceError");
        const store = renderWithProviders(initialState);

        // Acts
        const apolloMocks = initApolloMock("deviceError");
        const { asFragment } = renderMockedComponent(store, apolloMocks, <ComputerPage/>);;

        // Asserts
        expect(asFragment()).toMatchSnapshot();
        expect(document.title).toBe(`Backup - unknown device`);
    })
})
