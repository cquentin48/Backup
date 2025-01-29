import NotFoundError from "../exception/errors/notFoundError";
import AlreadyAddedWarning from "../exception/warning/alreadyAdded";
import Filter from "./Filter";

/**
 * Rows of the filter
 */
export interface FilterRow {
    elementType: "File" | "Library"
    fieldName: string
    comparisonType: "<" | ">" | "!=" | "=="
    value: object
    id: number
}

/**
 * MainDeviceInformationsFilterManager
 */
class FilterManager {
    /**
     * Filters set in the filter main device informations
     */
    private filters: [Filter?] = [];

    /**
     * Adds a new filter inside the table
     * @param {"File" | "Library" } elementType 
     * @param {string} fieldName 
     * @param { "<" | ">" | "!=" | "==" } comparisonType 
     * @param {object} value 
     */
    addFilter(
        elementType: "File" | "Library",
        fieldName: string,
        comparisonType: "<" | ">" | "!=" | "==",
        value: object
    ) {
        const newFilter = new Filter(elementType, fieldName, comparisonType, value);
        if (this.filters.includes(newFilter)) {
            throw new AlreadyAddedWarning("The filter is already set! It will be ignored!")
        } else {
            this.filters.push(newFilter);
        }
    }

    /**
     * Remove a filter based off its index in the array
     * @param {number} filterID id of the stored filter in the array
     * @throws {NotFoundError} Id set by the user outside of the range of the array indexes
     */
    removeFilter(filterID: number) {
        if (filterID >= this.filters.length) {
            throw new NotFoundError(`The index ${filterID} set is not in the array list!`)
        }
        delete this.filters[filterID];
    }

    /**
     * Fetch every filter set
     * @returns {FilterRow[]} Filter list 
     */
    public getFilters(): FilterRow[] {
        const input = JSON.parse(JSON.stringify(this.filters));
        input.forEach((element: FilterRow, index: number) => {
            element.id = index
        });
        return input;
    }

    /**
     * Fetched a filter based off its id in the array
     * @param {number} id id of the supposed stored filter
     * @returns {Filter|undefined} Filter set at the id requested by the user
     * @throws {NotFoundError} Id set by the user outside of the range of the array indexes
     */
    public getFilter(id: number): Filter {
        if (id >= this.filters.length) {
            throw new NotFoundError(`The index ${id} set is not in the array list!`)
        }
        return this.filters[id]!;
    }
}

/**
 * Singleton controller object used for the filter managment in the device main informations page
 */
export const filterManager = new FilterManager();