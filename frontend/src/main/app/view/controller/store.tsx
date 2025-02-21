import { configureStore } from "@reduxjs/toolkit";

import loadSnapshotReducer from "./deviceMainInfos/loadSnapshotSlice";
import loadDeviceReducer from "./deviceMainInfos/loadDeviceSlice";
import filterReducer from "./deviceMainInfos/filterSlice";

export const store = configureStore({
    reducer: {
        loadSnapshot: loadSnapshotReducer,
        filters: filterReducer,
        device: loadDeviceReducer
    }
})

export type AppState = ReturnType<typeof store.getState>;