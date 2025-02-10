import NotFoundError from "../exception/errors/notFoundError";
import AlreadyAddedWarning from "../exception/warning/alreadyAdded";
import { SnapshotSoftware } from "./snapshotLibrary";

/**
 * Snapshot data fetched from the query
 */
export class SnapshotData {
    /**
     * Every software
     */
    softwares: SnapshotSoftware[];

    /**
     * Class object constructor method
     */
    constructor () {
        this.softwares = [];
    }

    /**
     *
     * @param {string} softwareVersion Version of the software
     * @param {string} softwareName Software name
     * @param {string} softwareInstallType Software installation type (e.g. ``apt``, ``snap``)
     * @throws {AlreadyAddedWarning} Already added sofware in the array
     */
    addSoftware (softwareVersion: string, softwareName: string, softwareInstallType: string): void {
        const newSoftware = new SnapshotSoftware(
            softwareVersion,
            softwareName,
            softwareInstallType
        )
        if (this.softwares.filter((software) => {
            const sameInstallType = software.softwareInstallType === softwareInstallType
            const sameName = software.softwareName === softwareName
            const sameVersion = software.softwareVersion === softwareVersion
            return sameInstallType && sameName && sameVersion
        }).length > 0) {
            throw new AlreadyAddedWarning("The snapshot has already been added! Thus the operation is ignored!")
        }
        this.softwares.push(newSoftware)
    }

    /**
     * Returns the related software stored with the ID given by the user
     * @param {number} softwareIndex software key index in the array
     * @returns {SnapshotSoftware} Found software
     * @throws {NotFoundError} In case of not found element
     */
    getSoftware (softwareIndex: number): SnapshotSoftware {
        if (softwareIndex >= this.softwares.length) {
            throw new NotFoundError("The software ID exceeds the software array size!")
        }
        return this.softwares[softwareIndex]
    }
}
