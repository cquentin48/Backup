import { configureStore, type EnhancedStore, type Reducer } from "@reduxjs/toolkit"
import { type OperationStatus, type AppState } from "../../main/app/controller/store"
import { deviceInitialState, type FetchDeviceSliceState } from "../../main/app/controller/deviceMainInfos/loadDeviceSlice";
import { type FilterSliceState } from "../../main/app/controller/deviceMainInfos/filterSlice";
import { type SnapshotSliceState } from "../../main/app/controller/deviceMainInfos/loadSnapshotSlice";

import FETCH_SNAPSHOT from '../../main/res/queries/snapshot.graphql';
import FETCH_DEVICE from '../../main/res/queries/computer_infos.graphql';
import { type DocumentNode, type FetchResult } from "@apollo/client";
import { type ResultFunction } from "@apollo/client/testing";
import NotFoundError from "../../main/app/model/exception/errors/notFoundError";
import { type LoadSnapshotQueryResult } from "../../main/app/model/queries/computer/loadSnapshot";
import { type SnapshotData } from "../../main/app/model/snapshot/snapshotData";
import type Device from "../../main/app/model/device/device";
import { type DeviceInfosQueryResult } from "../../main/app/model/queries/computer/deviceInfos";
import { useSelector } from "react-redux";
import type Filter from "../../main/app/model/filters/Filter";

/**
 * GraphQL operation status
 */
type MockOperationStatus = "initial" | "loadingDevice" | "loadingSnapshot" | "success" | "deviceError" | "snapshotError" | "filterError";
type Reducers = FetchDeviceSliceState | FilterSliceState | SnapshotSliceState;

interface GenericAction {
    type: string
    payload?: any
}

/**
 * Initialise the reducer for a slice based off its initialSate
 * @param {Reducers} initialState InitialSate
 * @returns {Reducer<any, GenericAction>} Reducer used for the mock store initialisation
 */
const staticReducer = (initialState: Reducers): Reducer<any, GenericAction> => {
    return (state = initialState ?? {}, action: GenericAction) => state;
};

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
export const createMockStore = (mockState: Partial<AppState>): EnhancedStore => {
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
        reducers.device = staticReducer(initialState.device as FetchDeviceSliceState ?? deviceInitialState)
    }
    if (initialState.filter !== null) {
        reducers.filter = staticReducer(initialState.filter as FilterSliceState)
    }
    if (initialState.snapshot !== null) {
        reducers.snapshot = staticReducer(initialState.snapshot as SnapshotSliceState)
    }

    return configureStore({
        preloadedState: initialState,
        reducer: reducers
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
 * @param {string[]} includedElements Elements included for the test
 * @param {SnapshotData|undefined} snapshot Snapshot set for the test
 * @param {Device|undefined} device Device set for the test
 * @param {Filter[]} filters Filters set for the test
 * @param {number[]} selectedFilteredIDS Selected filter(s) for the test
 * @returns {Partial<AppState>} Initial state for the redux useSelector mocked function
 */
export const initInitialState = (operationStatus: MockOperationStatus, includedElements: string[] = [], snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, filters: Filter[] = [], selectedFilteredIDS: number[] = []): Partial<AppState> => {
    return {
        device: includedElements.includes("device") || operationStatus === "deviceError"
            ? {
                device: operationStatus === "success" ? JSON.parse(JSON.stringify(device)) : undefined,
                deviceError: {
                    message: operationStatus === "deviceError" ? "Error in device load query" : "",
                    variant: operationStatus === "deviceError" ? "error" : undefined
                },
                deviceLoading: operationStatus === "loadingDevice"
            }
            : undefined,
        snapshot: includedElements.includes("snapshot") || operationStatus === "snapshotError"
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
            : undefined
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
export const initApolloMock = (operationStatus: MockOperationStatus, snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, queries: string[] = []): Map<string, ApolloMockResult> => {
    const mocks = new Map<string, ApolloMockResult>()

    if (operationStatus === "success" && ((device === undefined && queries.includes("device")) || (snapshot === undefined && queries.includes("snapshot")))) {
        const faultyObject = device === undefined ? "device" : "snapshot"
        throw new NotFoundError(`Invalid operation : if the test type is a success, the $
            ${faultyObject} must be defined!`)
    }
    mocks.set("fetchSnapshot", {
        request: {
            query: FETCH_SNAPSHOT
        },
        result: {
            data: operationStatus === "success"
                ? {
                    snapshotInfos: snapshot
                }
                : undefined,
            errors: operationStatus !== "snapshotError"
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
                    deviceInfos: device as Device
                }
                : undefined,
            errors: operationStatus !== "snapshotError"
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
 * Init the ``useSelector`` Mock for the unit test
 * @param {Partial<AppState>} store Mocked store
 */
export const initUseSelectorMock = (store: Partial<AppState>): void => {
    const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
    mockedUseSelector.mockImplementation((selector: (state: Partial<AppState>) => unknown) => {
        const deviceState = store.device
        const snapshotState = store.snapshot
        const filterState = store.filter

        return selector(
            {
                device: deviceState !== undefined
                    ? {
                        device: deviceState.device,
                        deviceError: {
                            message: deviceState.deviceError !== undefined ? deviceState.deviceError.message : "",
                            variant: deviceState.deviceError !== undefined ? deviceState.deviceError.variant : undefined
                        },
                        deviceLoading: deviceState.deviceLoading
                    }
                    : undefined,
                snapshot: snapshotState !== undefined
                    ? {
                        operationStatus: snapshotState.operationStatus,
                        snapshot: snapshotState.snapshot,
                        snapshotError: {
                            message: snapshotState.snapshotError !== undefined ? snapshotState.snapshotError.message : "",
                            variant: snapshotState.snapshotError !== undefined ? snapshotState.snapshotError.variant : undefined
                        }
                    }
                    : undefined,
                filter: filterState !== undefined
                    ? {
                        filterError: {
                            message: filterState.filterError !== undefined ? filterState.filterError.message : "",
                            variant: filterState.filterError !== undefined ? filterState.filterError.variant : undefined
                        },
                        filters: filterState.filters,
                        selectedFilteredIDS: filterState.selectedFilteredIDS
                    }
                    : undefined
            }
        )
    }
    )
}
