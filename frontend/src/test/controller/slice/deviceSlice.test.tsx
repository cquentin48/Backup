import deviceReducer, { FetchDeviceSliceState } from "../../../main/app/controller/deviceMainInfos/loadDeviceSlice"
import Device from "../../../main/app/model/device/device"
import { fetchDeviceInfos } from "../../../main/app/model/queries/computer/deviceInfos"

describe("Device slice test suite", ()=>{
    test("Extra reducer : loading data", ()=>{
        // Given
        const initialState: FetchDeviceSliceState = {
            device: undefined,
            deviceError: undefined,
            deviceLoading: false
        }

        // Acts
        const deviceSlice = deviceReducer(initialState, fetchDeviceInfos.pending("", ""));

        // Asserts
        expect(deviceSlice.device).toBe(undefined)
        expect(deviceSlice.deviceError).toBe(undefined)
        expect(deviceSlice.deviceLoading).toBe(true)
    })

    test("Extra reducer : successful loaded data", ()=>{
        // Given
        const initialState: FetchDeviceSliceState = {
            device: undefined,
            deviceError: undefined,
            deviceLoading: false
        }
        const device = new Device("Computer name!")

        // Acts
        const deviceSlice = deviceReducer(initialState, fetchDeviceInfos.fulfilled(device,"",""))

        // Asserts
        expect(deviceSlice.device).toBe(device)
        expect(deviceSlice.deviceError).toBe(undefined)
        expect(deviceSlice.deviceLoading).toBe(false)
    })

    test("Extra reducer : failed to load data", ()=>{
        // Given
        const initialState: FetchDeviceSliceState = {
            device: undefined,
            deviceError: undefined,
            deviceLoading: false
        }

        // Acts
        const deviceSlice = deviceReducer(initialState, fetchDeviceInfos.rejected(new Error("Refused here!"),"","", "Refused here!"))

        // Asserts
        expect(deviceSlice.device).toBe(undefined)
        expect(deviceSlice.deviceError).not.toBe(undefined)
        expect((deviceSlice.deviceError as any).message).toBe("Refused here!")
        expect((deviceSlice.deviceError as any).variant).toBe("error")
        expect(deviceSlice.deviceLoading).toBe(false)
    })
})