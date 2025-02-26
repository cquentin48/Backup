import { configureStore } from "@reduxjs/toolkit";

import deviceReducer from "./deviceMainInfos/loadDeviceSlice";
import filterReducer from "./deviceMainInfos/filterSlice";
import snapshotReducer from "./deviceMainInfos/loadSnapshotSlice";

export const store = configureStore({
    reducer: {
        device: deviceReducer,
        filter: filterReducer,
        snapshot: snapshotReducer
    }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
