import NotFoundError from "../../../main/app/model/exception/errors/notFoundError"
import AlreadyAddedWarning from "../../../main/app/model/exception/warning/alreadyAdded"
import { SnapshotData } from "../../../main/app/model/snapshot/snapshotData"

describe("Snapshot data", () => {
    test("Add software (not yet added)", () => {
        // Given
        const snapshotData = new SnapshotData()

        const newSoftwareVersion = "1.0"
        const newSoftwareName = "My software!"
        const newSoftwareInstallType = "digital"

        // Acts
        snapshotData.addSoftware(newSoftwareVersion, newSoftwareName, newSoftwareInstallType)

        // Asserts
        const addedObject = snapshotData.versions[0]
        expect(addedObject.chosenVersion).toBe(newSoftwareVersion)
        expect(addedObject.name).toBe(newSoftwareName)
        expect(addedObject.installType).toBe(newSoftwareInstallType)
    })

    test("Add software (already added)", () => {
        // Given
        const snapshotData = new SnapshotData()

        const newSoftwareVersion = "1.0"
        const newSoftwareName = "My software!"
        const newSoftwareInstallType = "digital"

        // Acts & asserts
        snapshotData.addSoftware(newSoftwareVersion, newSoftwareName, newSoftwareInstallType)
        expect(() => { snapshotData.addSoftware(newSoftwareVersion, newSoftwareName, newSoftwareInstallType); }).toThrowError(AlreadyAddedWarning)
    })

    test("Get sofware (added before)", () => {
        // Given
        const snapshotData = new SnapshotData()

        const version = "1.0"
        const softwareName = "My software!"
        const softwareInstallType = "digital"

        snapshotData.addSoftware(version, softwareName, softwareInstallType)

        // Acts
        const opResult = snapshotData.getSoftware(0)

        // Asserts
        expect(opResult.installType).toBe(softwareInstallType)
        expect(opResult.name).toBe(softwareName)
        expect(opResult.chosenVersion).toBe(version)
    })

    test("Get sofware (not yet added)", () => {
        // Given
        const snapshotData = new SnapshotData()

        // Acts & Asserts
        expect(() => snapshotData.getSoftware(0)).toThrowError(NotFoundError)
    })
})
