import { configureStore, type EnhancedStore, type Reducer } from "@reduxjs/toolkit"
import { type AppState } from "../main/app/controller/store"

const staticReducer = (initialState: any): Reducer => {
    return (state = initialState) => state;
};

export const createMockStore = (mockState?: Partial<AppState>): EnhancedStore => {
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

    if (initialState.device != null) {
        reducers.device = staticReducer(initialState.device)
    }
    if (initialState.filter != null) {
        reducers.filter = staticReducer(initialState.filter)
    }
    if (initialState.snapshot != null) {
        reducers.snapshot = staticReducer(initialState.snapshot)
    }

    return configureStore({
        preloadedState: initialState,
        reducer: reducers
    })
}
