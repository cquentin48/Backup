import ControllerAction from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import Filter from "../../model/filters/Filter";

/**
 * "Adds new filter" controller action set in the device main information page.
 */
class AddDeviceMainInfosFilter extends ControllerAction {

    /**
     * Set new filter inside for the device main information view.
     * @param { string } inputs Inputs set by the user for the new filter.
     */
    performAction (inputs: string): void {
        inputs = JSON.parse(inputs)
        const name = inputs[0];
        const fieldName = inputs[1];
        const comparison = inputs[2];
        const value = inputs[3] as unknown as object;

        Filter.inputTypeAuthorizedList(name);
        Filter.comparisonTypesCheck(comparison);

        filterManager.addFilter(
            name as "File" | "Library",
            fieldName,
            comparison as "<" | ">" | "!=" | "==",
            value
        )
        const tableViewCallBackMethod = this.getObservable("mainDeviceInfosFilterTable");

        tableViewCallBackMethod(JSON.stringify(filterManager.getFilters()))

        const librariesFilters = filterManager.getFilters().filter((filter)=>{return filter.elementType === "Library"})
        const libraryViewCallBackMethod = this.getObservable("softwareInfosPieChart")
        libraryViewCallBackMethod(JSON.stringify(librariesFilters))
    }
}

export const addFilter = new AddDeviceMainInfosFilter();
