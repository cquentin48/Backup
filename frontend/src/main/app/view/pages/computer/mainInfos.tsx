import React from "react";
import type Device from "../../../model/device/device";

import DeviceMainInfosHeader from "../../controller/deviceMainInfos/deviceMainInfosHeader";
import SpecsMainInfos from "./sections/MainInfos";

import '../../../../res/css/ComputerMainInfos.css';

/**
 * Loaded device from the computer page component
 */
interface DeviceMainInfosProps {
    device: Device
}

/**
 * Computer main informations display component class
 * @param {DeviceMainInfosProps} props Loaded device from the computer page component
 * @returns {React.JSX.Element} rendered web component
 */
export default function DeviceMainInfos (props: DeviceMainInfosProps): React.JSX.Element {
    return (
        <div id="deviceMainInfos">
            <SpecsMainInfos device={props.device} />
            <DeviceMainInfosHeader device={props.device} />
            <br />
        </div>
    )
}
