import React from "react";
import MainInfosFrame from "../../widget/computer/mainInfos";
import ComputeSideNavBar from "../../widget/computer/navBar/computerSideNavBar";

/**
 * Device informations display page
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
