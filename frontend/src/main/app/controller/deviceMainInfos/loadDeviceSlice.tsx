import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type AppState } from "../store";
import type Device from "../../model/device/device";
import { fetchDeviceInfos } from "../../model/queries/computer/deviceInfos";
import { NotificationError } from "../utils";

/**
 * Device slice state interface
 */
export interface FetchDeviceSliceState {
    /**
     * Current fetched device from the server
     */
    device: Device | undefined

    /**
     * If the device is loading or not
     */
    deviceLoading: boolean

    /**
     * Device error
     */
    deviceError: NotificationError;
}

const initialState: FetchDeviceSliceState = {
    device: undefined,
    deviceLoading: false,
    deviceError: {
        message: "",
        variant: undefined
    }
}

const loadDeviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeviceInfos.pending, (state) => {
                state.deviceLoading = true;
                state.device = undefined;
                state.deviceError = {
                    message: "",
                    variant: undefined
                };
            })
            .addCase(fetchDeviceInfos.fulfilled, (state, action: PayloadAction<any>) => {
                state.deviceLoading = false;
                state.device = action.payload;
                state.deviceError = {
                    message: "",
                    variant: undefined
                };
            })
            .addCase(fetchDeviceInfos.rejected, (state, action) => {
                state.deviceLoading = false;
                state.device = undefined;
                state.deviceError = {
                    message: action.payload as string,
                    variant: "error"
                };
            });
    }
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deviceState = (state: AppState) => state.device
export default loadDeviceSlice.reducer
