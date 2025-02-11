import { type Observable, type CallbackMethod } from "../controllerActions";
import type ControllerAction from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import NotFoundError from "../../../model/exception/errors/notFoundError";
import snapshotData from "../../../../res/queries/snapshot.graphql";
import gqlClient from "../../../model/queries/client";
import { snapshotGQLData } from "../../../model/queries/computer/snapshotGQLData";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";
import { dataManager } from "../../../model/AppDataManager";

/**
 * "Adds new filter" controller action set in the device main information page.
 */
class LoadSnapshot implements ControllerAction {
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
                " page hasn't been mounted yet for the filter adding operation!")
        }
        const tableViewObservable = this.observable[name]
        return tableViewObservable;
    }

    /**
     * Set new filter inside for the device main information view.
     * @param { string } inputs Inputs set by the user for the new filter.
     */
    performAction (inputs: string): void {
        const selectedSnapshotID = JSON.parse(inputs);
        const query = snapshotData;
        snapshotGQLData.compute_query(
            gqlClient,
            query,
            {
                snapshotID: selectedSnapshotID
            }
        ).then((result: SnapshotData) => {
            dataManager.addElement("snapshot", result);
            const callBackMethod = this.getObservable("mainDeviceInfosSoftwareInfosPieChart");

            callBackMethod(JSON.stringify(filterManager.getFilters()));
        }).catch((error) => {
            console.error(error)
        })
    }

    addObservable (name: string, callback: (updatedData: string) => void): void {
        this.observable[name] = callback
    }

    removeObservable (name: string): void {
        if (!(name in this.observable)) {
            throw new NotFoundError(`The observable with the key name ${name} has not been set!`)
        }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.observable[name];
    }
}

export const loadSnapshot = new LoadSnapshot();
