import React from "react";

import { render, type RenderResult } from "@testing-library/react"

import '@testing-library/jest-dom'

import { Provider } from "react-redux";
import { MockedProvider, type ResultFunction } from "@apollo/client/testing";

import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import { type DeviceInfosQueryResult } from "../../../../main/app/model/queries/computer/deviceInfos";
import { type EnhancedStore } from "@reduxjs/toolkit";

import SpecsMainInfos from "../../../../main/app/view/pages/computer/sections/MainInfos";

import { type LoadSnapshotQueryResult } from "../../../../main/app/model/queries/computer/loadSnapshot";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";
import { type AppState } from "../../../../main/app/controller/store";
import { type DocumentNode, type FetchResult } from "@apollo/client";

import { createMockStore, initApolloMock, initInitialState, initUseSelectorMock } from "../../utils";

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

interface ApolloMockResult {
    request: {
        query: DocumentNode
    }
    result: FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult>, any> | undefined
}

describe("Device main infos test suite", () => {
    const renderMockedComponent = (store: EnhancedStore<AppState>, apolloMocks: Map<string, ApolloMockResult>): RenderResult => {
        return render(
            <Provider store={store}>
                <MockedProvider mocks={Array.from(apolloMocks.values())} addTypename={false}>
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
        const store = createMockStore(initialState)
        initUseSelectorMock(store.getState())

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
        const store = createMockStore(initialState)
        initUseSelectorMock(store.getState())

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
        const store = createMockStore(initialState)
        initUseSelectorMock(store.getState())

        const apolloMocks = initApolloMock("loadingSnapshot")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })
})
