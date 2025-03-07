import { configureStore, type EnhancedStore, type Reducer } from "@reduxjs/toolkit"
import { type AppState } from "../../main/app/controller/store"
import DeviceReducer, { FetchDeviceSliceState } from "../../main/app/controller/deviceMainInfos/loadDeviceSlice";
import FilterReducer, { FilterSliceState } from "../../main/app/controller/deviceMainInfos/filterSlice";
import SnapshotReducer, { SnapshotSliceState } from "../../main/app/controller/deviceMainInfos/loadSnapshotSlice";

import FETCH_SNAPSHOT from '../../main/res/queries/snapshot.graphql';
import FETCH_DEVICE from '../../main/res/queries/computer_infos.graphql';
import { DocumentNode, FetchResult } from "@apollo/client";
import { ResultFunction } from "@apollo/client/testing";
import NotFoundError from "../../main/app/model/exception/errors/notFoundError";
import { LoadSnapshotQueryResult } from "../../main/app/model/queries/computer/loadSnapshot";
import { SnapshotData } from "../../main/app/model/snapshot/snapshotData";
import Device from "../../main/app/model/device/device";
import { DeviceInfosQueryResult } from "../../main/app/model/queries/computer/deviceInfos";
import { useSelector } from "react-redux";
import Filter from "../../main/app/model/filters/Filter";
import NotImplementedError from "../../main/app/model/exception/errors/notImplementedError";

/**
 * GraphQL operation status
 */
type OperationStatus = "initial" | "loadingDevice" | "loadingSnapshot" | "success" | "deviceError" | "snapshotError" | "filterError";
type Reducers = FetchDeviceSliceState | FilterSliceState | SnapshotSliceState;

const staticReducer = (initialState: Reducers): Reducer => {
    return (state = initialState) => state;
};

/**
 * Apollo GraphQL query mock result
 */
interface ApolloMockResult {
    /**
     * GraphQL query request
     */
    request: {
        /**
         * GraphQL query
         */
        query: DocumentNode;
    };
    /**
     * GraphQL Query result
     */
    result: FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult | DeviceInfosQueryResult>, any> | undefined;
}

/**
 * Create a mock store for unit test
 * @param {Partial<AppState>} mockState Mock state
 * @returns 
 */
export const createMockStore = (mockState: Partial<AppState>): EnhancedStore => {
    const initialState: Partial<AppState> = {};

    if (mockState !== undefined) {
        if (mockState.device != null) {
            initialState.device = {
                ...mockState.device
            }
        }
        if (mockState.filter != null) {
            initialState.filter = {
                ...mockState.filter
            }
        }
        if (mockState.snapshot != null) {
            initialState.snapshot = {
                ...mockState.snapshot
            }
        }
    }

    const reducers: Record<string, Reducer> = {};

    if (initialState.device !== null) {
        reducers.device = staticReducer(initialState.device as FetchDeviceSliceState)
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

const filterOperationStatus = (operationStatus: OperationStatus) => {
    switch(operationStatus){
        case "loadingDevice":
        case "loadingSnapshot":
            return "loading";
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

const snapshotOperationStatus = (operationStatus: OperationStatus) => {
    switch(operationStatus){
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

export const initInitialState = (operationStatus: OperationStatus, includedElements:string[], snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, filter: Filter[] = [], selectedFilteredIDS: number[] = []): Partial<AppState> => {
    return {
        device: includedElements.includes("device") ? {
            device: operationStatus === "success" ? device : undefined,
            deviceError: {
                message: operationStatus === "deviceError" ? "Error in device load query" : "",
                variant: operationStatus === "deviceError" ? "error" : undefined
            },
            deviceLoading: operationStatus === "loadingDevice"
        } : undefined,
        snapshot: includedElements.includes("snapshot") ? {
            snapshot: operationStatus === "success" ? snapshot : undefined,
            snapshotError: {
                message: operationStatus === "snapshotError" ? "Error in snapshot load query" : "",
                variant: operationStatus === "snapshotError" ? "error" : undefined
            },
            operationStatus: snapshotOperationStatus(operationStatus)
        } : undefined,
        filter: includedElements.includes("filter") ? {
            filters: operationStatus === "success" ? filter : [],
            filterError: {
                message: operationStatus === "filterError" ? "Error in filter" : "",
                variant: operationStatus === "filterError" ? "error" : undefined
            },
            selectedFilteredIDS: selectedFilteredIDS,
        } : undefined,
    }
}

/**
 * Init apollo mocks for the unit test
 * @param {OperationStatus} operationStatus GraphQL query operation status
 * @param {SnapshotData | undefined} snapshot Snapshot used for test
 * @param {Device | undefined} device Device used for test
 * @param {str[]} queries Queries used for the test
 * @returns {Map<string,ApolloMockResult>} Apollo mock queries result
 */
export const initApolloMock = (operationStatus: OperationStatus, snapshot: SnapshotData | undefined = undefined, device: Device | undefined = undefined, queries: string[]): Map<string, ApolloMockResult> => {
    const mocks = new Map<string, ApolloMockResult>()

    if (operationStatus === "success" && ((device === undefined && queries.includes("device")) || (snapshot === undefined && queries.includes("snapshot")))) {
        const faultyObject = device === undefined ? "device" : snapshot
        throw new NotFoundError(`Invalid operation : if the test type is a success, the $
            ${faultyObject} must be defined!`)
    }
    mocks.set("fetchSnapshot", {
        request: {
            query: FETCH_SNAPSHOT
        },
        result: {
            data: operationStatus === "success" ? {
                snapshotInfos: snapshot
            } : undefined,
            errors: operationStatus !== "snapshotError" ? [
                {
                    message: "Snapshot GraphQL error message here!"
                }
            ] : []
        }
    })

    mocks.set("fetchDevice", {
        request: {
            query: FETCH_DEVICE
        },
        result: {
            data: operationStatus === "success" ? {
                deviceInfos: device as Device
            } : undefined,
            errors: operationStatus !== "snapshotError" ? [
                {
                    message: "Snapshot GraphQL error message here!"
                }
            ] : []
        }
    })

    return mocks
}


/**
 * Init the ``useSelector`` Mock for the unit test
 * @param {Device|undefined} device Device fetched from the server. If successful, must be loaded, otherwise could be left blank.
 * @param {SnapshotData} snapshot Fetched snapshot from the server.
 */
export const initUseSelectorMock = (store: Partial<AppState>): void => {
    const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
    mockedUseSelector.mockImplementation((selector: (state: Partial<AppState>) => unknown) => {
        const deviceState = store.device
        const snapshotState = store.snapshot
        const filterState = store.filter

        return selector(
            {
                device: deviceState !== undefined ? {
                    device: deviceState.device,
                    deviceError: {
                        message: deviceState.deviceError.message,
                        variant: deviceState.deviceError.variant,
                    },
                    deviceLoading: deviceState.deviceLoading
                } : undefined,
                snapshot: snapshotState !== undefined ? {
                    operationStatus: snapshotState.operationStatus,
                    snapshot: snapshotState.snapshot,
                    snapshotError: {
                        message: snapshotState.snapshotError.message,
                        variant: snapshotState.snapshotError.variant,
                    }
                } : undefined,
                filter: filterState !== undefined ? {
                    filterError : {
                        message: filterState.filterError.message,
                        variant: filterState.filterError.variant,
                    },
                    filters: filterState.filters,
                    selectedFilteredIDS: filterState.selectedFilteredIDS
                } : undefined
            }
        )
    }
    )
}