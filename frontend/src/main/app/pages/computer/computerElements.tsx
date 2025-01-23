import React from "react";
import type Computer from "../../model/computer/computer";
import MainInfosFrame from "../../widget/computer/mainInfos";
import ComputeSideNavBar from "../../widget/computer/navBar/computerSideNavBar";

interface ComputerElementProps {
    computer: Computer
}

export default function ComputerElements(props: ComputerElementProps): JSX.Element {
    const [selectedID, updateSelectedID] = React.useState(0);

    return (
        <div id="deviceElementsPage" style={{
            display: "flex"
        }}>
            <ComputeSideNavBar
                selectedID={selectedID}
                updateSelectedID={updateSelectedID}
            />
                <MainInfosFrame computer={props.computer} />
        </div>
    )
}
