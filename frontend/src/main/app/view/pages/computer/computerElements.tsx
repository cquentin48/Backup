import React from "react";
import type Device from "../../../model/device/device";
import MainInfosFrame from "../../widget/computer/mainInfos";
import ComputeSideNavBar from "../../widget/computer/navBar/computerSideNavBar";

/**
 * Selected device for the display of its informations
 */
interface ComputerElementProps {
    /**
     * Selected device
     */
    device: Device | undefined
}

/**
 * Device informations display page
 * @param {ComputerElementProps} props Selected device for the display of informations
 * @returns {React.JSX.Element} Page web component
 */
export default function DeviceElements (props: ComputerElementProps): React.JSX.Element {
    const [selectedID, updateSelectedID] = React.useState(0);

    return (
        <div id="deviceElementsPage">
            <ComputeSideNavBar
                selectedID={selectedID}
                updateSelectedID={updateSelectedID}
            />
            <MainInfosFrame device={props.device} />
        </div>
    )
}
