import { dataManager } from "../../../main/app/model/AppDataManager"
import Device from "../../../main/app/model/device/device"
import SnapshotID from "../../../main/app/model/device/snapshotId"

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
        dataManager.setElement("device", newDevice)

        // Acts
        const opResult = newDevice.formatBytes(newDevice.memory)
        const expectedResult = "4 GB"

        // Assert
        expect(opResult).toBe(expectedResult)
    })

    test("A device is undefined if values are defaults one", ()=>{
        // Acts
        const device = new Device()
        const opResult = device.isUndefined()
        const expectedResult = true

        // Asserts
        expect(opResult).toBe(expectedResult)
    })

    test("A device with at least one non default value isn't undefined", ()=>{
        // Acts
        const firstDevice = new Device("My device!")
        const secondDevice = new Device("", "My processor!")
        const thirdDevice = new Device("","", 1)
        const fourthDevice = new Device("", "", -1, 1)
        const fifthDevice = new Device("", "", -1, -1, [new SnapshotID("1","2000-01-01","My OS!")])

        const expectedResult = false

        // Asserts
        expect(firstDevice.isUndefined()).toBe(expectedResult)
        expect(secondDevice.isUndefined()).toBe(expectedResult)
        expect(thirdDevice.isUndefined()).toBe(expectedResult)
        expect(fourthDevice.isUndefined()).toBe(expectedResult)
        expect(fifthDevice.isUndefined()).toBe(expectedResult)
    })
})
