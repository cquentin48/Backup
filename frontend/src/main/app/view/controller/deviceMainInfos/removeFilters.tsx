import { type Observable, type CallbackMethod } from "../controllerActions";
import type ControllerAction from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import NotFoundError from "../../model/exception/errors/notFoundError";

/**
 *
 * ``Filter(s) removal`` controller action set in the device main information page.
 */
class RemoveDeviceMainInfosFilter implements ControllerAction {
    observable: Observable;

    /**
     * Controller for the filter addition in the device main informations page
     */
    constructor () {
        this.observable = {};
    }

    /**
     * Fetch the observable based off its name.
     * @param {string} name Observable name
     * @returns {Observable} observable used for later callback
     */
    getObservable (name: string): CallbackMethod {
        if (!(name in this.observable)) {
            throw new NotFoundError("The filter table in the device main informations" +
                " page hasn't been mounted yet for the filter delete operation!")
        }
        const tableViewObservable = this.observable[name]
        return tableViewObservable;
    }

    /**
     * Set new filter inside for the device main information view.
     * @param { unknown[] } inputs Inputs set by the user for the new filter.
     */
    performAction (inputs: unknown[]): void {
        let filterIDS = inputs.map((filterID: unknown) => {
            return filterID as number;
        });
        filterIDS = filterIDS.sort((firstID, secondID) => {
            return firstID - secondID
        }).reverse();

        filterIDS.forEach((filterID: number) => {
            filterManager.removeFilter(filterID)
        });

        const callBackMethod = this.getObservable("mainDeviceInfosFilterTable");
        callBackMethod(filterManager.getFilters())
    }

    addObservable (name: string, callback: (updatedData: unknown[]) => void): void {
        this.observable[name] = callback;
    }

    removeObservable (name: string): void {
        if (!(name in this.observable)) {
            throw new NotFoundError(`The observable with the key name ${name} has not been set!`)
        }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.observable[name];
    }
}

export const removeDeviceMainInfosFilter = new RemoveDeviceMainInfosFilter();
