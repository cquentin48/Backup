import { createAsyncThunk } from "@reduxjs/toolkit";
import BasicQueryParameters from "../basicQueryParameters";

import getDeviceInfos from "../../../../res/queries/computer_infos.graphql";
import gqlClient from "../client";
import Device from "../../device/device";
import SnapshotID from "../../device/snapshotId";

export const fetchDeviceInfos = createAsyncThunk(
    'device/deviceInfos',
    async (parameters: BasicQueryParameters, { rejectWithValue }) => {
        const result = (
            await gqlClient.execute_query(
                getDeviceInfos,
                parameters as BasicQueryParameters
            )
        )
        if (result === null || result.data.errors) {
            return rejectWithValue("The device wasn't found!")
        }

        const deviceData = result.data.deviceInfos
        const rawSnapshots = deviceData.snapshots;
        const snapshots: SnapshotID[] = []
        rawSnapshots.forEach((element: any) => {
            snapshots.push(
                new SnapshotID(
                    element.key,
                    element.date,
                    element.operatingSystem
                )
            )
        });
        return new Device(
            deviceData.name,
            deviceData.processor,
            deviceData.cores,
            deviceData.memory,
            snapshots
        )
    }
);