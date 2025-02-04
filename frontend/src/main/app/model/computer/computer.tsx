import type SnapshotID from "./saves";

/**
 * Computer Data class
 */
class Computer {
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
     * Computer operating system name
     */
    operatingSystem: string;

    /**
     * Computer save snapshots
     */
    snapshots: [SnapshotID?];

    /**
     * Constructor method
     * @param { string } name computer network name
     * @param { string } processor computer processor model
     * @param { number } cores computer cores
     * @param { number } memory computer volatile memory
     * @param { string } operatingSystem computer operating system name
     * @param { [SnapshotID?] } snapshots header of every save uploaded from the device
     */
    constructor (
        name: string, processor: string, cores: number, memory: number,
        operatingSystem: string, snapshots: [SnapshotID?]) {
        this.name = name;
        this.processor = processor;
        this.cores = cores;
        this.memory = memory;
        this.operatingSystem = operatingSystem;
        this.snapshots = snapshots;
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
}

export default Computer;
