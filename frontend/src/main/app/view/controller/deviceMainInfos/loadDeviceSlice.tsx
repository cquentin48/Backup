import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type Device from "../../../model/device/device";
import { fetchDeviceInfos } from "../../../model/queries/computer/deviceInfos";

interface LoadDeviceSliceInitialState {
    device: Device | undefined
    loading: boolean
    error: {
        message: string
        variant: "error" | "default" | "success" | "warning" | "info" | undefined
    } | undefined
}

const initialState: LoadDeviceSliceInitialState = {
    device: undefined,
    loading: false,
    error: {
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
                state.loading = true;
                state.device = undefined;
                state.error = undefined;
            })
            .addCase(fetchDeviceInfos.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.device = action.payload;
                state.error = undefined;
            })
            .addCase(fetchDeviceInfos.rejected, (state, action) => {
                state.loading = false;
                state.device = undefined;
                state.error = {
                    message: action.payload as string,
                    variant: "error"
                };
            });
    }
})

export default loadDeviceSlice.reducer
