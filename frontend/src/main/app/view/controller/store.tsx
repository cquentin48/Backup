import { configureStore } from "@reduxjs/toolkit";

import loadSnapshotReducer from "./deviceMainInfos/loadSnapshotSlice";
import filterReducer from "./deviceMainInfos/filterSlice";

export const store = configureStore({
    reducer: {
        loadSnapshot: loadSnapshotReducer,
        filters: filterReducer
    }
})

export type AppState = ReturnType<typeof store.getState>;