import React from "react";

import SpecsMainInfos from "./sections/MainInfos";

import '../../../../res/css/ComputerMainInfos.css';
import DeviceMainInfosHeader from "./sections/deviceMainInfosHeader";

/**
 * Data transmitted to the parent
 */
interface DeviceMainInfosProps{
    /**
     * Currently selected snapshot ID
     */
    currentSnapshotID: string;
};

/**
 * Computer main informations display component class
 * @returns {React.JSX.Element} rendered web component
 */
export default function DeviceMainInfos (props: DeviceMainInfosProps): React.JSX.Element {
    return (
        <div id="deviceMainInfos">
            <SpecsMainInfos/>
            <DeviceMainInfosHeader currentSnapshotID={props.currentSnapshotID}/>
            <br />
        </div>
    )
}
