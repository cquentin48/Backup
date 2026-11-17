import { createAsyncThunk } from "@reduxjs/toolkit";
import type BasicQueryParameters from "../basicQueryParameters";

import getDeviceInfos from "../../../../res/queries/computer_infos.graphql";
import gqlClient from "../client";
import Device from "../../device/device";
import SnapshotID from "../../device/snapshotId";
import { type ApolloQueryResult } from "@apollo/client";

export interface DeviceInfosQueryResult {
    deviceInfos: Device
}

export const fetchDeviceInfos = createAsyncThunk(
    'device/deviceInfos',
    async (parameters: BasicQueryParameters, { rejectWithValue }) => {
        const result = (
            gqlClient.execute_query(
                getDeviceInfos,
                parameters
            ).then((result: ApolloQueryResult<DeviceInfosQueryResult>)=>console.log(result))
        );

        /*

        console.log(result);

        if (result.errors != null) {
            return rejectWithValue("The device wasn't found!")
        }

        const deviceData = result.data.deviceInfos;
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
        )*/
    }
);
