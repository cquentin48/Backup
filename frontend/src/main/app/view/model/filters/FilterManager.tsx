import NotFoundError from "../../../model/exception/errors/notFoundError";
import AlreadyAddedWarning from "../../../model/exception/warning/alreadyAdded";
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
    private readonly filters: Filter[] = [];

    /**
     * Adds a new filter inside the table
     * @param {"File" | "Library" } elementType Type of element to apply the filter on
     * @param {string} fieldName Name of the property on which the filter will apply
     * @param { "<" | ">" | "!=" | "==" } comparisonType Type of the comparison (e.g. lower than, higher than, ...)
     * @param {object} value Value for the filter to apply on
     */
    addFilter (
        elementType: "File" | "Library",
        fieldName: string,
        comparisonType: "<" | ">" | "!=" | "==",
        value: object
    ): void {
        const newFilter = new Filter(elementType, fieldName, comparisonType, value);
        if (this.filters.filter((filter) => {
            const comparedFilter = filter
            const elementTypeCheck = comparedFilter.elementType === elementType;
            const fieldNameCheck = comparedFilter.fieldName === fieldName;
            const comparisonTypeCheck = comparedFilter.opType === comparisonType;
            const valueCheck = comparedFilter.filterValue === value;
            return elementTypeCheck && fieldNameCheck && comparisonTypeCheck && valueCheck
        }).length > 0) {
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
    removeFilter (filterID: number): void {
        if (filterID >= this.filters.length) {
            throw new NotFoundError(`The index ${filterID} set is not in the array list!`)
        }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        this.filters.splice(filterID, 1);
    }

    /**
     * Fetch every filter set
     * @returns {FilterRow[]} Filter list
     */
    public getFilters (): FilterRow[] {
        const input = JSON.parse(JSON.stringify(this.filters));
        input.forEach((element: FilterRow, index: number) => {
            element.id = index
        });
        return input;
    }

    public softwareFilters (): Filter[] {
        return this.filters.filter((filter) => filter.elementType === "Library")
    }

    /**
     * Fetched a filter based off its id in the array
     * @param {number} id id of the supposed stored filter
     * @returns {Filter|undefined} Filter set at the id requested by the user
     * @throws {NotFoundError} Id set by the user outside of the range of the array indexes
     */
    public getFilter (id: number): Filter | undefined {
        if (!(id in this.filters)) {
            throw new NotFoundError(`The index ${id} set is not in the array list!`);
        }
        return this.filters[id];
    }
}

/**
 * Singleton controller object used for the filter managment in the device main informations page
 */
export const filterManager = new FilterManager();
