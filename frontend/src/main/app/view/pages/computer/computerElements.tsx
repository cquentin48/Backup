import React from "react";
import MainInfosFrame from "./mainInfosFrame";
import ComputeSideNavBar from "./navBar/computerSideNavBar";

/**
 * Device informations display page
 * @param {DeviceElementsProps} props Loaded device from the computer page
 * @returns {React.JSX.Element} Page web component
 */
export default function DeviceElements (): React.JSX.Element {
    const [selectedID, updateSelectedID] = React.useState(0);

    return (
        <div id="deviceElementsPage">
            <ComputeSideNavBar
                selectedID={selectedID}
                updateSelectedID={updateSelectedID}
            />
            <MainInfosFrame/>
        </div>
    )
}
