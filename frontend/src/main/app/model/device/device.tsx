import SnapshotID from "./snapshotId";

/**
 * Device Data class
 */
class Device {
    /**
     * Computer name
     */
    name: string;

    /**
     * Computer processor device name
     */
    processor: string;

    /**
     * Computer cores amount
     */
    cores: number;

    /**
     * Computer volatile memory amount
     */
    memory: number;

    /**
     * Computer save snapshots
     */
    snapshots: SnapshotID[];

    /**
     * Constructor method
     * @param { string } name computer network name
     * @param { string } processor computer processor model
     * @param { number } cores computer cores
     * @param { number } memory computer volatile memory
     * @param { SnapshotID[] } snapshots header of every save uploaded from the device
     */
    constructor (
        name: string = "", processor: string = "", cores: number = -1, memory: number = -1,
        snapshots: SnapshotID[] = [new SnapshotID()]) {
        this.name = name;
        this.processor = processor;
        this.cores = cores;
        this.memory = memory;
        this.snapshots = snapshots;
    }

    /**
     * From JSON string result, creates a ``Device`` object alongside the related snapshots
     * @param {string} parsedData Device parsed data
     * @returns {Device} Device object
     */
    static fromJSON (parsedData: string): Device {
        const rawDeviceData = JSON.parse(parsedData) as Device
        const rawSnapshots = rawDeviceData.snapshots
        const snapshots: SnapshotID[] = []
        rawSnapshots.forEach((rawSnapshot) => {
            const rawDate = new Date(rawSnapshot.date)
            snapshots.push(
                new SnapshotID(
                    rawSnapshot.key,
                    `${rawDate.getFullYear()}-${rawDate.getMonth()}-${rawDate.getDay()}`,
                    rawSnapshot.operatingSystem
                )
            )
        })
        return new Device(
            rawDeviceData.name,
            rawDeviceData.processor,
            rawDeviceData.cores,
            rawDeviceData.memory,
            snapshots
        )
    }

    /**
     * Format memory for visualisation
     * @param { number } memory volatile memory quantity
     * @returns { string } Amount in bytes formated
     */
    formatBytes (memory: number): string {
        const units = ['Bytes', 'kB', 'MB', 'GB', 'TB']
        let formattedMemory: number = memory;
        let unitIndex: number = 0;
        while (formattedMemory > 1000) {
            formattedMemory /= 1000;
            unitIndex += 1;
        }
        formattedMemory = Math.round(formattedMemory * 100) / 100
        return `${formattedMemory} ${units[unitIndex]}`
    }

    /**
     * Check if the current device object is undefined or not
     * @returns {boolean} ``true`` yes | ``false`` no
     */
    isUndefined (): boolean {
        const nameCondition = this.name === ""
        const processorCondition = this.processor === ""
        const coresCondition = this.cores <= 0
        const memoryCondition = this.memory <= 0
        const snapshotConditions = this.snapshots.length === 1 && this.snapshots[0].isUndefined()

        return nameCondition && processorCondition && coresCondition && memoryCondition && snapshotConditions
    }
}

export default Device;
