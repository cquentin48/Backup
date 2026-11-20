import React, { Dispatch, SetStateAction } from "react";
import MainInfosFrame from "./mainInfosFrame";
import ComputeSideNavBar from "./navBar/computerSideNavBar";

/**
 * Data transmitted to the parent
 */
interface DeviceElementsProps {
    /**
     * Currently selected snapshot ID
     */
    previousCurrentSnapshotID: string;

    /**
     * Update the snapshot ID to the new one
     */
    setCurrentSnapshotID: Dispatch<SetStateAction<string>>;
};

/**
 * Device informations display page
 * @returns {React.JSX.Element} Page web component
 */
export default function DeviceElements (props: DeviceElementsProps): React.JSX.Element {
    const [selectedID, updateSelectedID] = React.useState(0);

    const {setCurrentSnapshotID, previousCurrentSnapshotID: currentSnapshotID} = props;

    return (
        <div id="deviceElementsPage">
            <ComputeSideNavBar
                selectedID={selectedID}
                updateSelectedID={updateSelectedID}
            />
            <MainInfosFrame
                setCurrentSnapshotID={setCurrentSnapshotID}
                currentSnapshotID={currentSnapshotID}
            />
        </div>
    )
}
