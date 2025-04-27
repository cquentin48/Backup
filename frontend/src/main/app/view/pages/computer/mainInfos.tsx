import React from "react";

import SpecsMainInfos from "./sections/MainInfos";

import '../../../../res/css/ComputerMainInfos.css';
import DeviceMainInfosHeader from "./sections/deviceMainInfosHeader";

/**
 * Computer main informations display component class
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
