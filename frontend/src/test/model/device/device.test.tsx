import Device from "../../../main/app/model/device/device"

describe("Device data model unit tests", () => {
    test('Gets device formatted bytes number', () => {
        // Given
        const newDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            "My OS",
            []
        )

        // Acts
        const opResult = newDevice.formatBytes(newDevice.memory)
        const expectedResult = "4 GB"

        // Assert
        expect(opResult).toBe(expectedResult)
    })
})
