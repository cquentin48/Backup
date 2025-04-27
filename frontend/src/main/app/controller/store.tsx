import { configureStore } from "@reduxjs/toolkit";

import deviceReducer from "./deviceMainInfos/loadDeviceSlice";
import filterReducer from "./deviceMainInfos/filterSlice";
import snapshotReducer from "./deviceMainInfos/loadSnapshotSlice";
import chatbotReducer from "./deviceMainInfos/chatbotSlice";

export const store = configureStore({
    reducer: {
        device: deviceReducer,
        filter: filterReducer,
        snapshot: snapshotReducer,
        chatbot: chatbotReducer
    }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type OperationStatus = "initial" | "loading" | "success" | "error"

export default store;
