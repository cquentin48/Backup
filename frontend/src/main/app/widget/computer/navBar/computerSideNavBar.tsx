import React from "react";
import { mdiDatabase } from "@mdi/js";
import { Info, Settings, Folder } from "@mui/icons-material";
import Icon from '@mdi/react';
import SideNavBarElement from "./sideNavBarElement";

import '../../../../res/css/NavBar.css';

interface ComputerSideNavProps{
    updateSelectedID: (newID: number) => void;
    selectedID: number
}

export default function ComputeSideNavBar(props: ComputerSideNavProps) {
    return (
        <div id="computerSideNav">
            <SideNavBarElement
                componentPath=""
                navBarLabel="Main informations"
                classId="mainInformations"
                image={
                    <Info style={{
                        display: "inline-block",
                        verticalAlign: "middle"
                    }} />
                }
                id={0}
                updateSelectedNumber={() => { props.updateSelectedID(0) }}
                selectedElement={props.selectedID}
            />
            <SideNavBarElement
                componentPath=""
                navBarLabel="Libraries"
                classId="libraries"
                image={
                    <Icon
                        path={mdiDatabase}
                        size={1}
                        style={{
                            display: "inline-block",
                            verticalAlign: "middle"
                        }}
                    />
                }
                id={1}
                updateSelectedNumber={() => { props.updateSelectedID(1) }}
                selectedElement={props.selectedID} />
            <SideNavBarElement
                componentPath=""
                navBarLabel="Software configurations"
                classId="softwareConfigurations"
                image={
                    <Settings
                        style={{
                            display: "inline-block",
                            verticalAlign: "middle"
                        }}
                    />
                }
                id={2}
                updateSelectedNumber={() => { props.updateSelectedID(2) }}
                selectedElement={props.selectedID} />
            <SideNavBarElement
                componentPath=""
                navBarLabel="Folder storage"
                classId="folderStorage"
                image={
                    <Folder
                        style={{
                            display: "inline-block",
                            verticalAlign: "middle"
                        }}
                    />
                }
                id={3}
                updateSelectedNumber={() => { props.updateSelectedID(3) }}
                selectedElement={props.selectedID} />
        </div>
    )
}