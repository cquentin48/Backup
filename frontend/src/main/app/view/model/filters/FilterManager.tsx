import AlreadyAddedWarning from "../exception/warning/alreadyAdded";
import Filter from "./Filter";

/**
 * 
 */
interface FilterRow{
    elementType: "File" | "Library"
    fieldName: string
    comparisonType: "<" | ">" | "!=" | "=="
    value: object
    id: number
}

/**
 * MainDeviceInformationsFilterManager
 */
class FilterManager{
    /**
     * Filters set in the filter main device informations
     */
    private filters:[Filter?] = [new Filter("File", "test", "!=", 3 as unknown as object)];

    /**
     * Adds a new filter inside the table
     * @param {"File" | "Library" } elementType 
     * @param {string} fieldName 
     * @param { "<" | ">" | "!=" | "==" } comparisonType 
     * @param {object} value 
     */
    addFilter(
        elementType: "File"|"Library",
        fieldName:string,
        comparisonType: "<" | ">" | "!=" | "==",
        value:object
    ){
        const newFilter = new Filter(elementType, fieldName, comparisonType, value);
        if(this.filters.includes(newFilter)){
            throw new AlreadyAddedWarning("The filter is already set! It will be ignored!")
        }else{
            this.filters.push(newFilter);
        }
    }

    /**
     * Remove a filter based off its index in the array
     * @param {number} filterID id of the stored filter in the array
     */
    removeFilter(filterID: number){
        if(filterID >= this.filters.length){
            throw new Error("")
        }
    }

    /**
     * Fetch every filter set
     * @returns {FilterRow[]} Filter list 
     */
    public getFilters (): FilterRow[] {
        const input = JSON.parse(JSON.stringify(this.filters));
        input.forEach((element:FilterRow, index: number) => {
            element.id = index
        });
        return input;
    }
}

/**
 * Singleton controller object used for the filter managment in the device main informations page
 */
export const filterManager = new FilterManager();