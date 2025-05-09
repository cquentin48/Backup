import snapshotInfos from "../../../../res/queries/snapshot.graphql";
import gqlClient from "../client";
import type BasicQueryParameters from "../basicQueryParameters";
import { SnapshotData } from "../../snapshot/snapshotData";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type ApolloQueryResult } from "@apollo/client";
import { type SnapshotSoftware } from "../../snapshot/snapshotLibrary";

export interface LoadSnapshotQueryResult {
    snapshotInfos: SnapshotData | undefined
}

export const fetchSnapshot = createAsyncThunk(
    'device/snapshotInfos',
    async (parameters: BasicQueryParameters, { rejectWithValue }) => {
        const result = (
            await gqlClient.execute_query(
                snapshotInfos,
                parameters
            ) as ApolloQueryResult<LoadSnapshotQueryResult>
        )
        if (result.errors != null) {
            return rejectWithValue("The snapshot you try to seek doesn't exist!")
        }
        const rawSnapshotData = result.data.snapshotInfos as SnapshotData;
        const rawSoftwares = rawSnapshotData.versions;
        const operatingSystem = rawSnapshotData.operatingSystem
        const snapshot = new SnapshotData(operatingSystem);
        rawSoftwares.forEach((softwareRaw: SnapshotSoftware) => {
            const chosenVersion = softwareRaw.chosenVersion;
            const name = softwareRaw.name;
            const installType = softwareRaw.installType;
            snapshot.addSoftware(
                chosenVersion,
                name,
                installType
            );
        });
        return snapshot;
    }
);
