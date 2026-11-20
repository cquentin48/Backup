
import { ApolloQueryResult } from "@apollo/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type BasicQueryParameters from "../basicQueryParameters";

import getDeviceInfos from "../../../../res/queries/computer_infos.graphql";
import { executeQuery } from "../client";
import Device from "../../device/device";
import SnapshotID from "../../device/snapshotId";

export interface DeviceInfosQueryResult {
    deviceInfos: Device
}

export const fetchDeviceInfos = createAsyncThunk(
    'device/deviceInfos',
    async (parameters: BasicQueryParameters, { rejectWithValue }) => {
        const result = (
            await executeQuery(
                getDeviceInfos,
                parameters
            ) as ApolloQueryResult<DeviceInfosQueryResult>
        );

        if (result.errors != null) {
            return rejectWithValue("The device wasn't found!")
        }

        //const deviceData = result.data.deviceInfos;
        const deviceData = result["deviceInfos"];
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
        );
    }
);
