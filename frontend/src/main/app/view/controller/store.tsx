import { configureStore } from "@reduxjs/toolkit";

import loadDeviceReducer from "./deviceMainInfos/loadDeviceSlice";
import filterReducer from "./deviceMainInfos/filterSlice";
import loadSnapshotReducer from "./deviceMainInfos/loadSnapshotSlice";

export const store = configureStore({
    reducer: {
        device: loadDeviceReducer,
        filter: filterReducer,
        snapshot: loadSnapshotReducer
    }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
