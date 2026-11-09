import React from "react";

import { render, type RenderResult } from "@testing-library/react"

import '@testing-library/jest-dom'

import { Provider } from "react-redux";
import { MockedProvider } from "@apollo/client/testing";

import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import { type EnhancedStore } from "@reduxjs/toolkit";

import SpecsMainInfos from "../../../../main/app/view/pages/computer/sections/MainInfos";

import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";

import { type ApolloMockResult, renderWithProviders, initApolloMock, initInitialState } from "../../utils/utils";

describe("Device main infos test suite", () => {

    const renderMockedComponent = (store: EnhancedStore, apolloMocks: Map<string, ApolloMockResult>): RenderResult => {
        return render(
            <Provider store={store}>
                    <MockedProvider
                        mocks={Array.from(apolloMocks.values())}>
                    <SpecsMainInfos />
                </MockedProvider>
            </Provider>
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

        const apolloMocks = initApolloMock("success", snapshot, device, ["snapshot", "device"])

        const initialState = initInitialState("success", ["snapshot", "device"], snapshot, device)
        const store = renderWithProviders(initialState)

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

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

        const initialState = initInitialState("snapshotError", ["snapshot", "device"], snapshot, device)
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("snapshotError", snapshot, device, ["snapshot", "device"])

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Loading specs main infos (loading)", async () => {
        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("loadingSnapshot", [])
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("loadingSnapshot")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })
})
