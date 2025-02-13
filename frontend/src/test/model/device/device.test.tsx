import { dataManager } from "../../../main/app/model/AppDataManager"
import Device from "../../../main/app/model/device/device"

describe("Device data model unit tests", () => {
    afterAll(() => {
        dataManager.removeAllData()
    })

    test('Gets device formatted bytes number', () => {
        // Given
        const newDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            []
        )
        dataManager.addElement("device", newDevice)

        // Acts
        const opResult = newDevice.formatBytes(newDevice.memory)
        const expectedResult = "4 GB"

        // Assert
        expect(opResult).toBe(expectedResult)
    })
})
