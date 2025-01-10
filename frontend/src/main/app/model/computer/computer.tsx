import Snapshot from "./saves";

/**
 * Computer Data class
 */
class Computer {
    name: string;
    processor: string;
    cores: number;
    memory: number;
    operatingSystem: string;
    snapshots: [Snapshot?];

    /**
     * Constructor method
     * @param name computer network name
     * @param processor computer processor model
     * @param cores computer cores
     * @param memory computer volatile memory
     * @param operatingSystem computer operating system name
     * @param snapshots header of every save uploaded from the device
     */
    constructor (
        name: string, processor: string, cores: number, memory: number,
        operatingSystem: string, snapshots: [Snapshot?]) {
        this.name = name;
        this.processor = processor;
        this.cores = cores;
        this.memory = memory;
        this.operatingSystem = operatingSystem;
        this.snapshots = snapshots;
    }

    /**
     * Format memory for visualisation
     * @param memory volatile memory quantity
     * @returns string
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
