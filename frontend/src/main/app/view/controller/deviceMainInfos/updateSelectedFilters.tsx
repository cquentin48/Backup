import ControllerAction from "../controllerActions";

/**
 * Update device main infos filter list action
 */
class UpdateDeviceMainInfosFilter extends ControllerAction {
    performAction (inputs: string): void {
        const selectedIDS = JSON.parse(inputs) as number[];

        const callbackmethod = this.getObservable('deviceMainInfosFooter');
        callbackmethod(JSON.stringify(selectedIDS));
    }
}

export const updateDeviceMainInfosFilter = new UpdateDeviceMainInfosFilter();
