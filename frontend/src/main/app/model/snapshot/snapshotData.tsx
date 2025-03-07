
import NotFoundError from "../exception/errors/notFoundError";
import NotImplementedError from "../exception/errors/notImplementedError";
import AlreadyAddedWarning from "../exception/warning/alreadyAdded";
import { type FilterComparisonType } from "../filters/Filter";
import type Filter from "../filters/Filter";
import type Repositories from "./repository";
import { SnapshotSoftware } from "./snapshotLibrary";

/**
 * Snapshot data fetched from the query
 */
export class SnapshotData {
    /**
     * Every software
     */
    versions: SnapshotSoftware[];

    repositories: Repositories[];

    operatingSystem: string;

    /**
     * Class object constructor method
     */
    constructor (operatingSystem: string = "") {
        this.versions = [];
        this.repositories = [];
        this.operatingSystem = operatingSystem;
    }

    /**
     *
     * @param {string} softwareVersion Version of the software
     * @param {string} softwareName Software name
     * @param {string} softwareInstallType Software source type (e.g. ``apt``, ``snap``)
     * @throws {AlreadyAddedWarning} Already added sofware in the array
     */
    addSoftware (softwareVersion: string, softwareName: string, softwareInstallType: string): void {
        const newSoftware = new SnapshotSoftware(
            softwareVersion,
            softwareName,
            softwareInstallType
        )
        if (this.versions.filter((software) => {
            const sameInstallType = software.installType === softwareInstallType
            const sameName = software.name === softwareName
            const sameVersion = software.version === softwareVersion
            return sameInstallType && sameName && sameVersion
        }).length > 0) {
            throw new AlreadyAddedWarning(`The software with the name ${softwareName} has already been added! Thus the operation is ignored!`)
        }
        this.versions.push(newSoftware)
    }

    /**
     * Returns the related software stored with the ID given by the user
     * @param {number} softwareIndex software key index in the array
     * @returns {SnapshotSoftware} Found software
     * @throws {NotFoundError} In case of not found element
     */
    getSoftware (softwareIndex: number): SnapshotSoftware {
        if (softwareIndex >= this.versions.length) {
            throw new NotFoundError("The software ID exceeds the software array size!")
        }
        return this.versions[softwareIndex]
    }

    /**
     * Apply filter on the software list
     * @param {SnapshotSoftware[]} softwares Software list where they will filtered with the conditions set
     * @param {object} value Value for the filter to be applied on
     * @param {FilterComparisonType} operator Type of condition (e.g. ``<`` or ``!=``)
     * @param {string} fieldName Name of the field for the condition (e.g. ``name``)
     * @returns {SnapshotSoftware[]} Software with the condition applied on
     */
    static applyFilterOn = (softwares: SnapshotSoftware[], value: object, operator: FilterComparisonType, fieldName: string): SnapshotSoftware[] => {
        switch (operator) {
            case "≠":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] !== value)
                })
            case "<":
                if (value.constructor.name === "String") {
                    return softwares.filter((software) => {
                        const leftOperand = JSON.parse(JSON.stringify(software))[fieldName].toLowerCase()
                        const rightOperand = JSON.parse(JSON.stringify(value)).toLowerCase()
                        return leftOperand < rightOperand
                    })
                }
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] < value)
                })

            case "<=":
                if (value.constructor.name === "String") {
                    return softwares.filter((software) => {
                        const leftOperand = JSON.parse(JSON.stringify(software))[fieldName].toLowerCase()
                        const rightOperand = JSON.parse(JSON.stringify(value)).toLowerCase()
                        return leftOperand <= rightOperand
                    })
                }
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] <= value)
                })
            case ">":
                if (value.constructor.name === "String") {
                    return softwares.filter((software) => {
                        const leftOperand = JSON.parse(JSON.stringify(software))[fieldName].toLowerCase()
                        const rightOperand = JSON.parse(JSON.stringify(value)).toLowerCase()
                        return leftOperand > rightOperand
                    })
                }
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] > value)
                })
            case ">=":
                if (value.constructor.name === "String") {
                    return softwares.filter((software) => {
                        const leftOperand = JSON.parse(JSON.stringify(software))[fieldName].toLowerCase()
                        const rightOperand = JSON.parse(JSON.stringify(value)).toLowerCase()
                        return leftOperand >= rightOperand
                    })
                }
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] > value)
                })
            case "==":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] === value)
                })
            case "startswith":
                return softwares.filter((software) => {
                    return (((software as any)[fieldName] as string).startsWith(value as unknown as string))
                })
            case "endswith":
                return softwares.filter((software) => {
                    return (((software as any)[fieldName] as string).endsWith(value as unknown as string))
                })
            case "includes":
                return softwares.filter((software) => {
                    return (((software as any)[fieldName] as string).includes(value as unknown as string))
                })
        }
    }

    static fetchFilteredSoftwares (snapshot: SnapshotData, filters: Filter[]): SnapshotSoftware[] {
        let softwares = snapshot.versions
        filters.forEach((filter) => {
            switch (filter.fieldName) {
                case "name":
                case "version":
                    softwares = SnapshotData.applyFilterOn(softwares, filter.value, filter.opType, filter.fieldName)
                    break;
                case "firstUploadDate":
                case "lastUploadDate":
                case "repository":
                case "size":
                    throw new NotImplementedError("Not implemented yet!")
                default:
                    throw new NotImplementedError("Unknown operation type!")
            }
        })
        return softwares
    }
}
