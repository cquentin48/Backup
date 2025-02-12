import SnapshotID from "../../../main/app/model/device/snapshot"

describe("Snapshot data model unit tests", () => {
    test('Gets snapshot localized date', () => {
        // Given
        const snapshotID = new SnapshotID(
            "1",
            "2020-01-01",
            "My OS!"
        )

        // Acts
        const opResult = snapshotID.localizedDate()

        // Asserts
        const expectedResult = "Saturday, February 1, 2020"
        expect(opResult).toBe(expectedResult)
    })
})
