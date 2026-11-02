import React from "react"

import { MockedProvider } from "@apollo/client/testing"
import { type EnhancedStore } from "@reduxjs/toolkit"
import '@testing-library/jest-dom'
import { render, type RenderResult } from "@testing-library/react"

import { Provider } from "react-redux"

import { dataManager } from "../../../../main/app/model/AppDataManager"

import ComputerPage from "../../../../main/app/view/pages/computer/computerPage"

import { ApolloMockResult, initApolloMock, initInitialState, renderWithProviders } from "../../utils/utils"
import { BrowserRouter } from "react-router-dom"
import { useSnackbar } from "notistack"
import Device from "../../../../main/app/model/device/device"
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData"
import MainInfosFrame from "../../../../main/app/view/pages/computer/mainInfosFrame"
import SnapshotID from "../../../../main/app/model/device/snapshotId"

describe("Device page", () => {
    afterEach(() => {
        dataManager.removeAllData()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    const renderMockedComponent = (store: EnhancedStore, apolloMocks: Map<string, ApolloMockResult>): RenderResult => {
        return render(
            <BrowserRouter>
                <Provider store={store}>
                    <div style={{ height: 400, width: '100%' }}>
                        <MockedProvider
                            mocks={Array.from(apolloMocks.values())}>
                            <MainInfosFrame/>
                        </MockedProvider>
                    </div>
                </Provider>
            </BrowserRouter>
        )
    }

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

    test.skip("Initial render (loading data)", async () => {
        // Before
        const initialState = initInitialState("loadingDevice", undefined, undefined, undefined);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, undefined);

        initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render", async () => {
        // Before
        const snapshot = new SnapshotData("myOS!");
        snapshot.addSoftware("test", "test software", "1.0");

        const currentDate = new Date();
        const device = new Device("mydevice", "myprocessor", 4, 17179869184, [new SnapshotID("0",currentDate.toDateString(), "myOS")]);

        initEnqueueSnackbarMock();

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);

        const apolloMocks = initApolloMock("success", snapshot, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot();
        expect(document.title).toBe(`Backup - device ${device.name}`);
    })

    test.skip("Error render (device unknown)", async () => {
        // Before
        const initialState = initInitialState("deviceError");
        const store = renderWithProviders(initialState);

        // Acts
        const apolloMocks = initApolloMock("deviceError");
        const { asFragment } = renderMockedComponent(store, apolloMocks);

        // Asserts
        expect(asFragment()).toMatchSnapshot();
        expect(document.title).toBe(`Backup - unknown device`);
    })
})
