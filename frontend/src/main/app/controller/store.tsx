import { combineReducers, configureStore, EnhancedStore } from "@reduxjs/toolkit";

import deviceReducer from "./deviceMainInfos/loadDeviceSlice";
import filterReducer from "./deviceMainInfos/filterSlice";
import snapshotReducer from "./deviceMainInfos/loadSnapshotSlice";
import chatbotReducer from "./chatbot/chatbotSlice";

const appReducer = combineReducers({
    device: deviceReducer,
    filter: filterReducer,
    snapshot: snapshotReducer,
    chatbot: chatbotReducer
})

/**
 * Setup the provider state (Used for the jest mocks only!)
 * @param {AppState | Partial<AppState>} preloadedState Application preloaded state
 * @returns {EnhancedStore} Redux store with preloaded state
 */
export function setupStore(preloadedState: AppState | Partial<AppState>): EnhancedStore{
    return configureStore({
        reducer: appReducer,
        preloadedState
    })
}

export const store = configureStore({
    reducer: {
        device: deviceReducer,
        filter: filterReducer,
        snapshot: snapshotReducer,
        chatbot: chatbotReducer
    }
})

export type PreloadedState = Parameters<typeof appReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type OperationStatus = "initial" | "loading" | "success" | "error"

export default store;
