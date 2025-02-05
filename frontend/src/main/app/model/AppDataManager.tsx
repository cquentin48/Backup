import NotFoundError from "./exception/errors/notFoundError";
import AlreadyAddedWarning from "./exception/warning/alreadyAdded";

/**
 * Application data manager
 */
class AppDataManager {
    /**
     * Map containing whole persistant data
     */
    private data: Map<string, string>;

    /**
     * Class constructor
     */
    public constructor () {
        this.data = new Map();
    }

    /**
     * Adds a new data object inside the map.
     * @param {string} elementKey new data key
     * @param {object} data new data to store
     * @throws {AlreadyAddedWarning} Warning when another data with the same key already set in the map
     */
    public addElement (elementKey: string, data: object) {
        if (this.data.has(elementKey)) {
            throw new AlreadyAddedWarning(`The key ${elementKey} has already been added inside the app data manager!`)
        }
        this.data.set(elementKey, JSON.stringify(data))
    }

    /**
     * Returns object stored in the map with the given key
     * @param {string} dataElementKey Key of the data supposedly stored in the map
     * @returns {object} stored data with given key
     * @throws {NotFoundError} No object found the function passed key.
     */
    public getElement (dataElementKey: string): string {
        if (!this.data.has(dataElementKey)) {
            throw new NotFoundError(`The key ${dataElementKey} hasn't been set inside the app data manager!`)
        }
        return this.data.get(dataElementKey)!
    }

    /**
     * Remove application data stored in the map if it's contained.
     * @param {string} dataElementKey key of the element inside the map
     * @throws {NotFoundError} No object found the function passed key.
     */
    public removeDataElement (dataElementKey: string) {
        if (!this.data.has(dataElementKey)) {
            throw new NotFoundError(`The key ${dataElementKey} hasn't been set inside the app data manager!`)
        }
        this.data.delete(dataElementKey)
    }

    /**
     * Check if a data with the key passed is set or not in the class map
     * @param {string} dataElementKey Key of the data supposedly stored in the map
     * @returns {boolean} ``true`` yes, ``false`` no
     */
    public dataElementContained (dataElementKey: string): boolean {
        return this.data.has(dataElementKey)
    }
}

export const dataManager = new AppDataManager()