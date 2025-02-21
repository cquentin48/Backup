import { createSlice } from "@reduxjs/toolkit";
import snapshotData from "../../../../res/queries/snapshot.graphql";
import { snapshotGQLData } from "../../../model/queries/computer/loadSnapshot";
import gqlClient from "../../../model/queries/client";
import { SnapshotData } from "../../../model/snapshot/snapshotData";

interface LoadSnapshotState{
    snapshot: SnapshotData| undefined;
    errorMessage: {
        type: "error" | "default" | "success" | "warning" | "info" | undefined;
        message: string;
    }
}

const initialState: LoadSnapshotState = {
    snapshot: undefined,
    errorMessage: {
        type: undefined,
        message: ''
    }
}

export const loadSnapshotSlice = createSlice({
    name: 'loadSnapshot',
    initialState: initialState,
    reducers: {
        loadSnapshot: (state, inputs) => {
            const selectedSnapshotID = JSON.parse(inputs.payload as string);
            const query = snapshotData;
            snapshotGQLData.computeQuery(
                gqlClient,
                query,
                {
                    snapshotID: selectedSnapshotID
                }
            ).then((result: SnapshotData) => {
                state.snapshot = result
            }).catch((error: Error) => {
                state.errorMessage = {
                    message: error.message,
                    type: undefined
                }
            })
        },
        eraseMessage: (state) => {
            state.errorMessage = {
                type: undefined,
                message: ''
            }
        }
    }
})

export const { loadSnapshot, eraseMessage } = loadSnapshotSlice.actions
export default loadSnapshotSlice.reducer