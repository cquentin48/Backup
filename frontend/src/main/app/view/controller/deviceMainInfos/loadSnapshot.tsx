import ControllerAction from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import snapshotData from "../../../../res/queries/snapshot.graphql";
import gqlClient from "../../../model/queries/client";
import { snapshotGQLData } from "../../../model/queries/computer/loadSnapshot";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";
import { dataManager } from "../../../model/AppDataManager";

/**
 * "Adds new filter" controller action set in the device main information page.
 */
class LoadSnapshot extends ControllerAction {

    /**
     * Set new filter inside for the device main information view.
     * @param { string } inputs Inputs set by the user for the new filter.
     */
    performAction (inputs: string): void {
        const selectedSnapshotID = JSON.parse(inputs);
        const query = snapshotData;
        snapshotGQLData.computeQuery(
            gqlClient,
            query,
            {
                snapshotID: selectedSnapshotID
            }
        ).then((result: SnapshotData) => {
            dataManager.setElement("snapshot", result);

            const callBackMethod = [this.getObservable("MainInfosFrame"), this.getObservable("softwareInfosPieChart")]
            for (let i = 0; i < callBackMethod.length; i++) {
                callBackMethod[i](JSON.stringify(filterManager.getFilters()))
            }
        }).catch(e=>{
            const error = e as Error
            const stack = (error.stack as string)
            console.log(stack)
        })
    }
}

export const loadSnapshot = new LoadSnapshot();
