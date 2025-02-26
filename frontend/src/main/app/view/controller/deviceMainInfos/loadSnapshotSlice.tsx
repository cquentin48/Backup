import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchSnapshot } from "../../../model/queries/computer/loadSnapshot";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";
import { type AppState } from "../store";

export interface SnapshotSliceState {
    snapshot: SnapshotData | undefined
    snapshotLoading: boolean
    snapshotError: string
}

const initialState: SnapshotSliceState = {
    snapshot: undefined,
    snapshotLoading: false,
    snapshotError: ""
}

export const snapshotSlice = createSlice({
    name: 'snapshot',
    initialState,
    reducers: {},
    extraReducers (builder) {
        builder.addCase(fetchSnapshot.pending, (state) => {
            state.snapshotLoading = true
            state.snapshotError = ""
            state.snapshot = undefined
        }).addCase(fetchSnapshot.rejected, (state, action) => {
            state.snapshotLoading = false
            state.snapshotError = action.error as string
            state.snapshot = undefined
        }).addCase(fetchSnapshot.fulfilled, (state, action: PayloadAction<SnapshotData>) => {
            state.snapshotLoading = false
            state.snapshotError = ""
            state.snapshot = action.payload
        })
    }
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const snapshotState = (state: AppState) => state.snapshot
export default snapshotSlice.reducer
