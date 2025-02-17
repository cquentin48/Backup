import ControllerAction, { CallbackMethod } from "../controllerActions";

import { filterManager } from "../../model/filters/FilterManager";
import getDeviceInfos from '../../../../res/queries/computer_infos.graphql';
import gqlClient from "../../../model/queries/client";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";
import { dataManager } from "../../../model/AppDataManager";
import { enqueueSnackbar } from "notistack";
import FetchComputerInfosGQL from "../../../model/queries/computer/computerInfos";
import Device from "../../../model/device/device";
import { useNavigate } from "react-router-dom";

/**
 * Load device controller action set in the device main information page.
 */
class LoadDevice extends ControllerAction {

    /**
     * Loads device from the graphQL backend url endpoint.
     * @param { string } inputs Device ID stored in database.
     */
    performAction (inputs: string): void {
        const selectedDeviceID = JSON.parse(inputs) as number;
        const query = getDeviceInfos;
        const gqlRetriever = new FetchComputerInfosGQL()
        gqlRetriever.compute_query(
            gqlClient,
            query,
            {
                deviceID: selectedDeviceID
            }
        ).then((device: Device) => {
            dataManager.setElement("device", device);
            const callBackMethod = this.getObservable("computerPage")
            callBackMethod(JSON.stringify(device))
        }).catch((error) => {
            console.error(error)
            enqueueSnackbar("Error while fetching the device!", { variant: "error" })
        })
    }
}

export const loadDevice = new LoadDevice();
