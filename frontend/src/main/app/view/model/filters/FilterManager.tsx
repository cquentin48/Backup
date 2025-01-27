import AlreadyAddedWarning from "../exception/warning/alreadyAdded";
import Filter from "./Filter";

/**
 * MainDeviceInformationsFilterManager
 */
class FilterManager{
    /**
     * Filters set in the filter main device informations
     */
    private filters:[Filter?] = [];

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

    removeFilter(filterID: number){
        if(filterID >= this.filters.length){
            throw new Error("")
        }
    }

    /**
     * Fetch every filter set
     */
    public getFilters (): [Filter?]{
        return this.filters;
    }
}

export const filterManager = new FilterManager();