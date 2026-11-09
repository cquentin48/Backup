import NotFoundError from "../../../main/app/model/exception/errors/notFoundError"
import NotImplementedError from "../../../main/app/model/exception/errors/notImplementedError"
import AlreadyAddedWarning from "../../../main/app/model/exception/warning/alreadyAdded"
import Filter from "../../../main/app/model/filters/Filter"
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
        expect(addedObject.version).toBe(newSoftwareVersion)
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
        expect(() => { snapshotData.addSoftware(newSoftwareVersion, newSoftwareName, newSoftwareInstallType); }).toThrow(AlreadyAddedWarning)
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
        expect(opResult.version).toBe(version)
    })

    test("Get sofware (not yet added)", () => {
        // Given
        const snapshotData = new SnapshotData()

        // Acts & Asserts
        expect(() => snapshotData.getSoftware(0)).toThrow(NotFoundError)
    })

    test("Filter sofware on element value different than other", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "My software" as any as object, "≠", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Filter sofware on element value equal", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "My software" as any as object, "==", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[0]);
    })

    test("Filter sofware on element value lower", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "My software" as any as object, "<", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Filter sofware on element value lower or equal", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "My 2nd software" as any as object, "<=", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Filter sofware on element value higher", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "My 2nd software" as any as object, ">", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[0]);
    })

    test("Filter sofware on element value higher or equal", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "My software" as any as object, ">=", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[0]);
    })

    test("Filter sofware on element value starting with a value", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "My 2nd" as any as object, "startswith", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Filter sofware on element value ending with a value", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "2nd software" as any as object, "endswith", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Filter sofware on element value including a value", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "2nd software" as any as object, "includes", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Fetch filtered sofware on name based", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.1", "My 2nd software", "unknown");

        const filter = new Filter("File", "name", "≠", "My software" as any as object, 0);

        // Acts
        const filteredSofwares = SnapshotData.fetchFilteredSoftwares(snapshotData, [filter]);

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Fetch filtered sofware on version based", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.1", "My 2nd software", "unknown");

        const filter = new Filter("File", "version", "==", "1.0" as any as object, 0);

        // Acts
        const filteredSofwares = SnapshotData.fetchFilteredSoftwares(snapshotData, [filter]);

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[0]);
    })

    test("Filter sofware on element value including a value", () => {
        // Given
        const snapshotData = new SnapshotData();
        snapshotData.addSoftware("1.0", "My software", "unknown");
        snapshotData.addSoftware("1.0", "My 2nd software", "unknown");

        // Acts
        const filteredSofwares = SnapshotData.applyFilterOn(snapshotData.versions, "2nd software" as any as object, "includes", "name")

        // Asserts
        expect(filteredSofwares.length).toBe(1);
        expect(filteredSofwares[0]).toBe(snapshotData.versions[1]);
    })

    test("Filter sofware on unknown element type should throw NotImplementedError exception", () => {
        // Given
        const snapshotData = new SnapshotData()
        snapshotData.addSoftware("1.0", "My software", "unknown")

        const filter = new Filter("File", "filter", "<", "3" as any as object, 0);

        // Acts & Asserts
        expect(() => SnapshotData.fetchFilteredSoftwares(snapshotData, [filter])).toThrow(NotImplementedError)
    })
})
