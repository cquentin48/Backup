import NotFoundError from "../../model/exception/errors/notFoundError";
import { filterManager } from "../../model/filters/FilterManager";
import ControllerAction, { CallbackMethod, Observable } from "../controllerActions";

class RemoveDeviceMainInfosFilter implements ControllerAction {
    observable: Observable;

    constructor() {
        this.observable = {};
    }

    /**
         * Fetch the observable based off its name.
         * @param {string} name Observable name
         * @returns {Observable} observable used for later callback
         */
    getObservable(name: string): CallbackMethod {
        if (!(name in this.observable)) {
            throw new NotFoundError("The filter table in the device main informations" +
                " page hasn't been mounted yet!")
        }
        const tableViewObservable = this.observable[name]
        return tableViewObservable;
    }

    performAction(inputs: unknown[]): void {
        var filterIDS = inputs.map((filterID: unknown) => {
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

    addObservable(name: string, callback: (updatedData: unknown[]) => void): void {
        this.observable[name] = callback
    }

    removeObservable(name: string): void {
        if (!(name in this.observable)) {
            throw new NotFoundError(`The observable with the key name ${name} has not been set!`)
        }
        delete this.observable[name];
    }
}

export const removeDeviceMainInfosFilter = new RemoveDeviceMainInfosFilter();