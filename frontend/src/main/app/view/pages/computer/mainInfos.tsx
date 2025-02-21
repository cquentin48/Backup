import React from "react";
import type Device from "../../../model/device/device";

import SpecsMainInfos from "./sections/MainInfos";

import '../../../../res/css/ComputerMainInfos.css';
import DeviceMainInfosHeader from "./sections/deviceMainInfosHeader";

/**
 * Computer main informations display component class
 * @param {DeviceMainInfosProps} props Loaded device from the computer page component
 * @returns {React.JSX.Element} rendered web component
 */
export default function DeviceMainInfos (): React.JSX.Element {
    return (
        <div id="deviceMainInfos">
            <SpecsMainInfos/>
            <DeviceMainInfosHeader/>
            <br />
        </div>
    )
}
