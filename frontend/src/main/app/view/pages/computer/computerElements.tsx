import React from "react";
import MainInfosFrame from "./mainInfosFrame";
import ComputeSideNavBar from "./navBar/computerSideNavBar";
import type Device from "../../../model/device/device";

interface DeviceElementsProps {
    device: Device
}

/**
 * Device informations display page
 * @param {DeviceElementsProps} props Loaded device from the computer page
 * @returns {React.JSX.Element} Page web component
 */
export default function DeviceElements (props: DeviceElementsProps): React.JSX.Element {
    const [selectedID, updateSelectedID] = React.useState(0);

    return (
        <div id="deviceElementsPage">
            <ComputeSideNavBar
                selectedID={selectedID}
                updateSelectedID={updateSelectedID}
            />
            <MainInfosFrame device={props.device}/>
        </div>
    )
}
