import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchSnapshot } from "../../model/queries/computer/loadSnapshot";
import { type SnapshotData } from "../../model/snapshot/snapshotData";
import { type OperationStatus, type AppState } from "../store";
import { type NotificationError } from "../utils";

export interface SnapshotSliceState {
    snapshot: SnapshotData | undefined
    operationStatus: OperationStatus
    snapshotError: NotificationError
}

export const snapshotInitialState: SnapshotSliceState = {
    snapshot: undefined,
    operationStatus: "initial",
    snapshotError: {
        message: "",
        variant: undefined
    }
}

export const snapshotSlice = createSlice({
    name: 'snapshot',
    initialState: snapshotInitialState,
    reducers: {},
    extraReducers (builder) {
        builder.addCase(fetchSnapshot.pending, (state) => {
            state.operationStatus = "loading"
            state.snapshotError = {
                message: "",
                variant: undefined
            }
            state.snapshot = undefined
        }).addCase(fetchSnapshot.rejected, (state, action) => {
            state.operationStatus = "error"
            state.snapshotError = {
                message: action.error.message as string,
                variant: "error"
            }
            state.snapshot = undefined
        }).addCase(fetchSnapshot.fulfilled, (state, action: PayloadAction<SnapshotData>) => {
            state.operationStatus = "success"
            state.snapshotError = {
                message: "",
                variant: undefined
            }
            state.snapshot = action.payload
        })
    }
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const snapshotState = (state: AppState) => state.snapshot
export default snapshotSlice.reducer
