import React from "react";
import type Device from "../../../model/device/device";

import '../../../../res/css/ComputerMainInfos.css';
import SpecsMainInfos from "../../widget/computer/sections/MainInfos";
import DeviceMainInfosHeader from "../../controller/deviceMainInfos/deviceMainInfosHeader";

interface DeviceMainInfosProps{
    device: Device;
}

/**
 * Computer main informations display component class
 */
export default function DeviceMainInfos(props: DeviceMainInfosProps):React.JSX.Element {
        return (
            <div id="computerMainInfos">
                <SpecsMainInfos device={props.device}/>
                <DeviceMainInfosHeader device={props.device}/>
                <br />
            </div>
        )
}
