import SnapshotID from "../../../main/app/model/device/snapshotId"

describe("Snapshot data model unit tests", () => {
    test('Gets snapshot localized date', () => {
        // Given
        const snapshotID = new SnapshotID(
            "1",
            "2020-01-01",
            "My OS!"
        )

        // Acts
        const opResult = SnapshotID.localizedDate(snapshotID.date)

        // Asserts
        const expectedResult = "Wednesday, January 1, 2020"
        expect(opResult).toBe(expectedResult)
    })
})
