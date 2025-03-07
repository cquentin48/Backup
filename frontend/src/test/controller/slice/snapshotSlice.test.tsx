import snapshotReducer, { type SnapshotSliceState } from "../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"

import { fetchSnapshot } from "../../../main/app/model/queries/computer/loadSnapshot"
import { SnapshotData } from "../../../main/app/model/snapshot/snapshotData"

describe("Snapshot slice test suite", () => {
    test("Extra reducer : loading data", () => {
        // Given
        const initialState: SnapshotSliceState = {
            snapshot: undefined,
            snapshotError: {
                message: "",
                variant: undefined
            },
            operationStatus: "initial"
        }

        // Acts
        const deviceSlice = snapshotReducer(initialState, fetchSnapshot.pending("", ""));

        // Asserts
        expect(deviceSlice.snapshot).toBe(undefined)
        expect(deviceSlice.snapshotError.message).toBe("")
        expect(deviceSlice.operationStatus).toBe("loading")
    })

    test("Extra reducer : successful loaded data", () => {
        // Given
        const initialState: SnapshotSliceState = {
            snapshot: undefined,
            snapshotError: {
                message: "",
                variant: undefined
            },
            operationStatus: "initial"
        }
        const snapshot = new SnapshotData("My OS!")
        snapshot.addSoftware("1.0", "My software!", "test install")

        // Acts
        const deviceSlice = snapshotReducer(initialState, fetchSnapshot.fulfilled(snapshot, "", ""))

        // Asserts
        expect(deviceSlice.snapshot).toBe(snapshot)
        expect(deviceSlice.snapshotError.message).toBe("")
        expect(deviceSlice.operationStatus).toBe("success")
    })

    test("Extra reducer : failed to load data", () => {
        // Given
        const initialState: SnapshotSliceState = {
            snapshot: undefined,
            snapshotError: {
                message: "",
                variant: undefined
            },
            operationStatus: "initial"
        }

        // Acts
        const deviceSlice = snapshotReducer(initialState, fetchSnapshot.rejected(new Error("Refused here!"), "", "", "Refused here!"))

        // Asserts
        expect(deviceSlice.snapshot).toBe(undefined)
        expect(deviceSlice.snapshotError.message).toBe("Refused here!")
        expect(deviceSlice.operationStatus).toBe("error")
    })
})
