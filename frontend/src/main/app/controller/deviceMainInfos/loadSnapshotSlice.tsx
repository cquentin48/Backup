import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchSnapshot } from "../../model/queries/computer/loadSnapshot";
import { type SnapshotData } from "../../model/snapshot/snapshotData";
import { type AppState } from "../store";

export interface SnapshotSliceState {
    snapshot: SnapshotData | undefined
    operationStatus: "initial" | "loading" | "success" | "error"
    snapshotError: string
}

const initialState: SnapshotSliceState = {
    snapshot: undefined,
    operationStatus: "initial",
    snapshotError: ""
}

export const snapshotSlice = createSlice({
    name: 'snapshot',
    initialState,
    reducers: {},
    extraReducers (builder) {
        builder.addCase(fetchSnapshot.pending, (state) => {
            state.operationStatus = "loading"
            state.snapshotError = ""
            state.snapshot = undefined
        }).addCase(fetchSnapshot.rejected, (state, action) => {
            state.operationStatus = "error"
            state.snapshotError = action.error as string
            state.snapshot = undefined
        }).addCase(fetchSnapshot.fulfilled, (state, action: PayloadAction<SnapshotData>) => {
            state.operationStatus = "success"
            state.snapshotError = ""
            state.snapshot = action.payload
        })
    }
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const snapshotState = (state: AppState) => state.snapshot
export default snapshotSlice.reducer
