import { configureStore } from "@reduxjs/toolkit";

import filterReducer from "./deviceMainInfos/filterSlice";
import loadDeviceReducer from "./deviceMainInfos/loadDeviceSlice";
import loadSnapshotReducer from "./deviceMainInfos/loadSnapshotSlice";

export const store = configureStore({
    reducer: {
        device: loadDeviceReducer,
        filters: filterReducer,
        snapshot: loadSnapshotReducer
    }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
