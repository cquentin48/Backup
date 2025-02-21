import { createSlice } from "@reduxjs/toolkit";
import Device from "../../../model/device/device";

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