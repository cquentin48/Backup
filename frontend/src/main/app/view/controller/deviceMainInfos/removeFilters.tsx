import ControllerAction from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";

/**
 *
 * ``Filter(s) removal`` controller action set in the device main information page.
 */
class RemoveDeviceMainInfosFilter extends ControllerAction {
    /**
     * Set new filter inside for the device main information view.
     * @param { string } inputs Inputs set by the user for the new filter.
     */
    performAction (inputs: string): void {
        const inputsIDS = JSON.parse(inputs) as string[]
        let filterIDS = inputsIDS.map((filterID: unknown) => {
            return filterID as number;
        });
        filterIDS = filterIDS.sort((firstID, secondID) => {
            return firstID - secondID
        }).reverse();

        filterIDS.forEach((filterID: number) => {
            filterManager.removeFilter(filterID)
        });

        const callBackMethods = [
            this.getObservable("mainDeviceInfosFilterTable"),
            this.getObservable("softwareInfosPieChart")
        ]
        for(let i = 0;i<2;i++){
            callBackMethods[i](JSON.stringify(filterManager.getFilters()))
        }
    }
}

export const removeDeviceMainInfosFilter = new RemoveDeviceMainInfosFilter();
