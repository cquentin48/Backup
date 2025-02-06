import Version from "../../../main/app/model/device/version"

describe("Versions model unit test", () => {
    test('Simple version construction', () => {
        // Given
        const versionName = "My version"
        const packageType = "Package type"
        const versionId = "1.0"

        // Acts
        const opResult = new Version(versionName, packageType, versionId)

        // Asserts
        expect(opResult.name).toBe(versionName)
        expect(opResult.packageType).toBe(packageType)
        expect(opResult.versionId).toBe(versionId)
    })
})