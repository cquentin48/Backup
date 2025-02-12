import React from "react";
import type Device from "../../../model/device/device";

import '../../../../res/css/ComputerMainInfos.css';
import SpecsMainInfos from "../../widget/computer/sections/MainInfos";
import DeviceMainInfosHeader from "../../controller/deviceMainInfos/deviceMainInfosHeader";

/**
 * Props interface for the computer main information display component class
 */
interface ComputerMainInfosProps {
    device: Device | undefined
}

/**
 * Computer main informations display component class
 */
export default class DeviceMainInfos extends React.Component<ComputerMainInfosProps> {
    render (): React.ReactNode {
        const emptyData = {
            name: "",
            snapshots: [{
                operatingSystem: "My OS"
            }]
        }
        const device = this.props.device;
        return (
            <div id="computerMainInfos">
                <SpecsMainInfos device={device} />
                <DeviceMainInfosHeader
                    isDeviceLoaded={device !== undefined}
                    name={(device ?? emptyData).name}
                    operatingSystem={(device ?? emptyData).snapshots[(device ?? emptyData).snapshots.length-1].operatingSystem}
                />
                <br />
            </div>
        )
    }
}
