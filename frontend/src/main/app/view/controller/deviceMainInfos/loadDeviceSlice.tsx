import { createSlice } from "@reduxjs/toolkit";
import Device from "../../../model/device/device";
import gqlClient from "../../../model/queries/client";
import FetchComputerInfosGQL from "../../../model/queries/computer/computerInfos";

import getDeviceInfos from '../../../../res/queries/computer_infos.graphql';

interface LoadDeviceSliceInitialState {
    device: Device | undefined;

    error: {
        message: string;
        variant: "error" | "default" | "success" | "warning" | "info" | undefined;
    }
}

const initialState: LoadDeviceSliceInitialState = {
    device: undefined,
    error: {
        message: "",
        variant: undefined
    }
}

export const loadDeviceSlice = createSlice({
    name: "Load device",
    initialState: initialState,
    reducers: {
        fetchDevice: (state, action) => {
            const selectedDeviceID = JSON.parse(action.payload) as number;
            const query = getDeviceInfos;
            const gqlRetriever = new FetchComputerInfosGQL()
            gqlRetriever.computeQuery(
                gqlClient,
                query,
                {
                    deviceID: selectedDeviceID
                }
            ).then((device: Device) => {
                // dataManager.setElement("device", device);
                state.device = device
            }).catch((error: Error) => {
                state.error = {
                    message: error.message,
                    variant: "error"
                }
            })
        },
        resetError: (state) => {
            state.error = {
                message: "",
                variant: undefined
            }
        }
    }
})

export const { fetchDevice, resetError } = loadDeviceSlice.actions

export default loadDeviceSlice.reducer