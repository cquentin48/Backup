import NotFoundError from "../../../model/exception/errors/notFoundError";
import { type CallbackMethod, type Observable } from "../controllerActions";
import type ControllerAction from "../controllerActions";

/**
 * Update device main infos filter list action
 */
class UpdateDeviceMainInfosFilter implements ControllerAction {
    observable: Observable;

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
                " page hasn't been mounted yet!")
        }
        const tableViewObservable = this.observable[name]
        return tableViewObservable;
    }

    performAction (inputs: string): void {
        const selectedIDS = JSON.parse(inputs) as number[];

        const callbackmethod = this.getObservable('deviceMainInfosFooter');
        callbackmethod(JSON.stringify(selectedIDS));
    }

    addObservable (name: string, callback: (updatedData: string) => void): void {
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

export const updateDeviceMainInfosFilter = new UpdateDeviceMainInfosFilter();
