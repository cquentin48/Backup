import ControllerAction from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import ValidationError from "../../model/exception/errors/validationError";
import Filter from "../../model/filters/Filter";

/**
 * "Adds new filter" controller action set in the device main information page.
 * @see {@link filterGridToolbar}
 */
class AddDeviceMainInfosFilter implements ControllerAction {

    /**
     * Set new filter inside for the device main information view.
     * @param { unknown[] } inputs Inputs set by the user for the new filter.
     */
    performAction(inputs: unknown[]): void {
        const name = inputs[0] as string;
        const fieldName = inputs[1] as string;
        const comparison = inputs[2] as string;
        const value = inputs[3] as object;

        Filter.inputTypeAuthorizedList(name);
        Filter.comparisonTypesCheck(comparison);

        filterManager.addFilter(
            name as "File" | "Library",
            fieldName,
            comparison as "<" | ">" | "!=" | "==",
            value
        )
    }

}

export const addFilter = new AddDeviceMainInfosFilter();