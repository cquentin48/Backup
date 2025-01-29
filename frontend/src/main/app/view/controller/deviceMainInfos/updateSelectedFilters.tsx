import NotFoundError from "../../model/exception/errors/notFoundError";
import { filterManager } from "../../model/filters/FilterManager";
import ControllerAction, { CallbackMethod, Observable } from "../controllerActions";

/**
 * Update device main infos filter list action
 */
class UpdateDeviceMainInfosFilter implements ControllerAction {
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
        const selectedIDS = inputs as number[];
        filterManager.updateSelectedIDS(selectedIDS);

        const callbackmethod = this.getObservable('deviceMainInfosFooter');
        callbackmethod(selectedIDS);
    }

    addObservable(name: string, callback: (updatedData: unknown[]) => void): void {
        throw new Error("Method not implemented.");
    }

    removeObservable(name: string): void {
        throw new Error("Method not implemented.");
    }
}

export const updateDeviceMainInfosFilter = new UpdateDeviceMainInfosFilter();