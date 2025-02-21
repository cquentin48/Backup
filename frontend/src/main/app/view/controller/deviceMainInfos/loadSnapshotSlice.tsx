import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSnapshot } from "../../../model/queries/computer/loadSnapshot";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";

interface LoadSnapshotState {
    snapshot: SnapshotData | undefined
    loading: boolean
    error: string
}

const initialState: LoadSnapshotState = {
    snapshot: undefined,
    loading: false,
    error: ""
}

export const loadSnapshotSlice = createSlice({
    name: 'loadSnapshot',
    initialState,
    reducers: {},
    extraReducers (builder) {
        builder.addCase(fetchSnapshot.pending, (state)=>{
            state.loading = true
            state.error = ""
            state.snapshot = undefined
        }).addCase(fetchSnapshot.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error as string
            state.snapshot = undefined
        }).addCase(fetchSnapshot.fulfilled, (state, action: PayloadAction<SnapshotData>)=>{
            state.loading = false
            state.error = ""
            state.snapshot = action.payload
        })
    },
})

export default loadSnapshotSlice.reducer
