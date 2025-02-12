import React from "react";
import type Device from "../../../model/device/device";

import '../../../../res/css/ComputerMainInfos.css';
import SpecsMainInfos from "../../widget/computer/sections/MainInfos";
import DeviceMainInfosHeader from "../../controller/deviceMainInfos/deviceMainInfosHeader";

/**
 * Props interface for the computer main information display component class
 */
interface ComputerMainInfosProps {
    computer: Device
}

/**
 * Computer main informations display component class
 */
export default class ComputerMainInfos extends React.Component<ComputerMainInfosProps> {
    render (): React.ReactNode {
        const computer = this.props.computer;
        return (
            <div id="computerMainInfos">
                <SpecsMainInfos computer={computer} />
                <DeviceMainInfosHeader
                    isDeviceLoaded={computer !== undefined}
                    name={computer.name}
                    operatingSystem={computer.operatingSystem}
                />
                <br />
            </div>
        )
    }
}
