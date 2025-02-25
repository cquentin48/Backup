import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type Device from "../../../model/device/device";
import { fetchDeviceInfos } from "../../../model/queries/computer/deviceInfos";
import { type AppState } from "../store";

interface LoadDeviceSliceInitialState {
    device: Device | undefined
    deviceLoading: boolean
    deviceError: {
        message: string
        variant: "error" | "default" | "success" | "warning" | "info" | undefined
    } | undefined
}

const initialState: LoadDeviceSliceInitialState = {
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
                state.deviceError = undefined;
            })
            .addCase(fetchDeviceInfos.fulfilled, (state, action: PayloadAction<any>) => {
                state.deviceLoading = false;
                state.device = action.payload;
                state.deviceError = undefined;
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
