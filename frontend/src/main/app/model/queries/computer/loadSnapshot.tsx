import snapshotInfos from "../../../../res/queries/snapshot.graphql";
import gqlClient from "../client";
import type BasicQueryParameters from "../basicQueryParameters";
import { SnapshotData } from "../../snapshot/snapshotData";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSnapshot = createAsyncThunk(
    'device/snapshotInfos',
    async (parameters: BasicQueryParameters, { rejectWithValue }) => {
        const result = (
            await gqlClient.execute_query(
                snapshotInfos,
                parameters as BasicQueryParameters
            )
        )
        try {
            console.log(JSON.stringify(result))
            if (result.errors) {
                return rejectWithValue("The snapshot you try to seek doesn't exist!")
            }
            const rawSnapshotData = result.data.snapshotInfos;
            const rawSoftwares = rawSnapshotData.versions;
            const snapshot = new SnapshotData();
            rawSoftwares.forEach((softwareRaw: any) => {
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
        catch (e) {
            return rejectWithValue("Selected snapshot doesn't exist!")
        }
    }
);