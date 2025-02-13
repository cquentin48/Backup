import ControllerAction, { CallbackMethod } from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import getDeviceInfos from '../../../../res/queries/computer_infos.graphql';
import gqlClient from "../../../model/queries/client";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";
import { dataManager } from "../../../model/AppDataManager";
import { enqueueSnackbar } from "notistack";
import ComputerInfos from "../../../model/queries/computer/computerInfos";
import Device from "../../../model/device/device";

/**
 * Load device controller action set in the device main information page.
 */
class LoadDevice extends ControllerAction {

    /**
     * Loads device from the graphQL backend url endpoint.
     * @param { string } inputs Device ID stored in database.
     */
    performAction (inputs: string): void {
        const selectedSnapshotID = JSON.parse(inputs);
        const query = getDeviceInfos;
        const gqlRetriever = new ComputerInfos()
        gqlRetriever.compute_query(
            gqlClient,
            query,
            {
                snapshotID: selectedSnapshotID
            }
        ).then((device: Device) => {
            dataManager.addElement("device", device);
            const callBackMethod = this.getObservable("computerPage")
            callBackMethod(JSON.stringify(""))
        }).catch((error) => {
            console.log(error)
            enqueueSnackbar(error, { variant: "error" })
        })
    }
}

export const loadDevice = new LoadDevice();
