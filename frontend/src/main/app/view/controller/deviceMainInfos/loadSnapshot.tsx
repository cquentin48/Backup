import ControllerAction from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import snapshotData from "../../../../res/queries/snapshot.graphql";
import gqlClient from "../../../model/queries/client";
import { snapshotGQLData } from "../../../model/queries/computer/snapshotGQLData";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";
import { dataManager } from "../../../model/AppDataManager";
import { enqueueSnackbar } from "notistack";

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
            enqueueSnackbar(error, { variant: "error" })
        })
    }
}

export const loadSnapshot = new LoadSnapshot();
