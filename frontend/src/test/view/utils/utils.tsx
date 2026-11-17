
import { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

import { RenderResult, render } from "@testing-library/react";
import * as redux from 'react-redux';
import { configureStore, type EnhancedStore, type Reducer } from "@reduxjs/toolkit"

import { type OperationStatus, type AppState } from "../../../main/app/controller/store"

import FETCH_SNAPSHOT from '../../../main/res/queries/snapshot.graphql';
import FETCH_DEVICE from '../../../main/res/queries/computer_infos.graphql';
import { type DocumentNode, type FetchResult } from "@apollo/client";
import { MockedProvider, type ResultFunction } from "@apollo/client/testing";
import NotFoundError from "../../../main/app/model/exception/errors/notFoundError";
import { type LoadSnapshotQueryResult } from "../../../main/app/model/queries/computer/loadSnapshot";
import { SnapshotData } from "../../../main/app/model/snapshot/snapshotData";
import type Device from "../../../main/app/model/device/device";
import { type DeviceInfosQueryResult } from "../../../main/app/model/queries/computer/deviceInfos";
import type Filter from "../../../main/app/model/filters/Filter";

import deviceReducer from "../../../main/app/controller/deviceMainInfos/loadDeviceSlice";
import filterReducer from "../../../main/app/controller/deviceMainInfos/filterSlice";
import snapshotReducer from "../../../main/app/controller/deviceMainInfos/loadSnapshotSlice";
import chatbotReducer from "../../../main/app/controller/chatbot/chatbotSlice";
import { useSnackbar } from "notistack";

/**
 * GraphQL operation status
 */
type MockOperationStatus = "initial" | "loadingDevice" | "loadingSnapshot" | "success" | "deviceError" | "snapshotError" | "filterError";

/**
 * Type of elements which can be selected
 */
type SelectedElementType = "device" | "snapshot" | "filter";

/**
 * Apollo GraphQL query mock result
 */
export interface ApolloMockResult {
    /**
     * GraphQL query request
     */
    request: {
        /**
         * GraphQL query
         */
        query: DocumentNode
    }
    /**
     * GraphQL Query result
     */
    result: FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult>, any> | undefined
}

/**
 * Create a mock store for unit test
 * @param {Partial<AppState>} mockState Mock state
 * @returns {EnhancedStore} Initialised mock store
 */
export const renderWithProviders = (
    mockState: Partial<AppState>
): EnhancedStore<Partial<AppState>> => {
    const initialState: Partial<AppState> = {};

    if (mockState !== undefined) {
        if (mockState.device !== undefined) {
            initialState.device = {
                ...mockState.device
            }
        }
        if (mockState.filter !== undefined) {
            initialState.filter = {
                ...mockState.filter
            }
        }
        if (mockState.snapshot !== undefined) {
            initialState.snapshot = {
                ...mockState.snapshot
            }
        }
    }

    const reducers: Record<string, Reducer> = {};

    if (initialState.device !== null) {
        reducers.device = deviceReducer;
    }
    if (initialState.filter !== null) {
        reducers.filter = filterReducer;
    }
    if (initialState.snapshot !== null) {
        reducers.snapshot = snapshotReducer;
    }
    reducers.chatbot = chatbotReducer;

    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        })
    })
}

/**
 * Set the operation status for the snapshot
 * @param {MockOperationStatus} operationStatus Operation status set in the mock for the mocked redux store
 * @returns {OperationStatus} Redux store operation status
 */
const snapshotOperationStatus = (operationStatus: MockOperationStatus): OperationStatus => {
    switch (operationStatus) {
        case "loadingSnapshot":
            return "loading";
        case "loadingDevice":
            return "initial";
        case "filterError":
        case "deviceError":
        case "snapshotError":
            return "error"
        case "initial":
        case "success":
        default:
            return operationStatus
    }
}

/**
 * Initialise the redux initial state
 * @param {MockOperationStatus} operationStatus Status set in the jest test
 * @param {SelectedElementType[]} includedElements Elements included for the test
 * @param {SnapshotData|undefined} snapshot Snapshot set for the test
 * @param {Device|undefined} device Device set for the test
 * @param {Filter[]} filters Filters set for the test
 * @param {number[]} selectedFilteredIDS Selected filter(s) for the test
 * @returns {Partial<AppState>} Initial state for the redux useSelector mocked function
 */
export const initInitialState = (operationStatus: MockOperationStatus, includedElements: SelectedElementType[] = [], snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, filters: Filter[] = [], selectedFilteredIDS: number[] = []): Partial<AppState> => {
     return {
        device: includedElements.includes("device") || operationStatus === "deviceError" || operationStatus === "loadingDevice"
            ? {
                device: operationStatus === "success" ? JSON.parse(JSON.stringify(device)) : undefined,
                deviceError: {
                    message: operationStatus === "deviceError" ? "Error in device load query" : "",
                    variant: operationStatus === "deviceError" ? "error" : undefined
                },
                deviceLoading: operationStatus === "loadingDevice"
            }
            : undefined,
        snapshot: includedElements.includes("snapshot") || operationStatus === "snapshotError" || operationStatus === "loadingSnapshot"
            ? {
                snapshot: operationStatus === "success" ? JSON.parse(JSON.stringify(snapshot)) : undefined,
                snapshotError: {
                    message: operationStatus === "snapshotError" ? "Error in snapshot load query" : "",
                    variant: operationStatus === "snapshotError" ? "error" : undefined
                },
                operationStatus: snapshotOperationStatus(operationStatus)
            }
            : undefined,
        filter: includedElements.includes("filter")
            ? {
                filters: operationStatus === "success" ? JSON.parse(JSON.stringify(filters)) : [],
                filterError: {
                    message: operationStatus === "filterError" ? "Error in filter" : "",
                    variant: operationStatus === "filterError" ? "error" : undefined
                },
                selectedFilteredIDS
            }
            : {
                filters: [],
                filterError: {
                    message: "",
                    variant: undefined
                },
                selectedFilteredIDS
            }
    }
}

/**
 * Init apollo mocks for the unit test
 * @param {MockOperationStatus} operationStatus GraphQL query operation status
 * @param {SnapshotData | undefined} snapshot Snapshot used for test
 * @param {Device | undefined} device Device used for test
 * @param {string[]} queries Queries used for the test
 * @returns {Map<string,ApolloMockResult>} Apollo mock queries result
 */
export const initApolloMock = (operationStatus: MockOperationStatus, snapshot: SnapshotData | Array<SnapshotData> | undefined = undefined, device: Device | undefined = undefined, queries: string[] = [], selectedSnapshot: number = -1): Map<string, ApolloMockResult> => {
    const mocks = new Map<string, ApolloMockResult>()

    if (operationStatus === "success" && ((device === undefined && queries.includes("device")) || (snapshot === undefined && queries.includes("snapshot")))) {
        const faultyObject = device === undefined ? "device" : "snapshot"
        throw new NotFoundError(`Invalid operation : if the test type is a success, the 
            ${faultyObject} must be defined!`)
    }
    mocks.set("fetchSnapshot", {
        request: {
            query: FETCH_SNAPSHOT
        },
        result: {
            data: operationStatus === "success" && snapshot !== undefined
                ? {
                    snapshotInfos: snapshot instanceof SnapshotData ? snapshot : ((snapshot as Array<SnapshotData>)[selectedSnapshot])
                }
                : undefined,
            errors: operationStatus === "deviceError"
                ? [
                    {
                        message: "Snapshot GraphQL error message here!"
                    }
                ]
                : []
        }
    })

    mocks.set("fetchDevice", {
        request: {
            query: FETCH_DEVICE
        },
        result: {
            data: operationStatus === "success"
                ? {
                    deviceInfos: device!
                }
                : undefined,
            errors: operationStatus === "deviceError"
                ? [
                    {
                        message: "Snapshot GraphQL error message here!"
                    }
                ]
                : []
        }
    })

    return mocks
}

/**
 * Builds a DOM element and returns it for the jest tests
 * @param {EnhancedStore} store Built store containing data and the related operations
 * @param {Map<String, ApolloMockResult>} apolloMocks GraphQL requests and errors result
 * @param {ReactElement} domElement Element built for the mocks tests
 * @param {boolean} hasURLParams If the DOM element has URL parameters (e.g. `element=3`)
 * @returns {RenderResult} Built element for the mock test
 */
export const renderMockedComponent = (store: EnhancedStore, apolloMocks: Map<string, ApolloMockResult>, domElement: ReactElement, hasURLParams: boolean = false): RenderResult => {
    const apolloProvider = <MockedProvider
        mocks={Array.from(apolloMocks.values())}>
        {domElement}
    </MockedProvider>
    const reduxProvider = <redux.Provider store={store}>
        {apolloProvider}</redux.Provider>
    if (hasURLParams) {
        return render(
            <BrowserRouter>
                {reduxProvider}
            </BrowserRouter>
        )
    }
    return render(reduxProvider);
}

/**
 * Rerender a previously rendered mocked component
 * @param {EnhancedStore} store Built store containing data and the related operations
 * @param {Map<String, ApolloMockResult>} apolloMocks GraphQL requests and errors result
 * @param {ReactElement} domElement Element built for the mocks tests
 * @param {boolean} hasURLParams If the DOM element has URL parameters (e.g. `element=3`)
 */
export const rerenderMockedComponent = (rerender: (ui:React.ReactNode)=> void, store: EnhancedStore, apolloMocks: Map<string, ApolloMockResult>, domElement: ReactElement, hasURLParams: boolean = false) => {
    const apolloProvider = <MockedProvider
        mocks={Array.from(apolloMocks.values())}>
        {domElement}
    </MockedProvider>
    const reduxProvider = <redux.Provider store={store}>
        {apolloProvider}</redux.Provider>
    if (hasURLParams) {
        return rerender(
            <BrowserRouter>
                {reduxProvider}
            </BrowserRouter>
        )
    }
    return rerender(reduxProvider);
}

/**
 * Mock ``enqueueSnackbar`` function
 * @returns {jest.Mock} Mocked ``enqueueSnackbar`` function
 */
export const initEnqueueSnackbarMock = (): jest.Mock => {
    const mockEnqueueSnackbar = jest.fn((message: string, variants) => "");
    (useSnackbar as jest.Mock).mockReturnValue({
        enqueueSnackbar: mockEnqueueSnackbar
    });

    return mockEnqueueSnackbar
}