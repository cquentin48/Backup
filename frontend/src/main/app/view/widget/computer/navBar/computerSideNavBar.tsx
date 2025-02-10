import React from "react";
import { mdiDatabase } from "@mdi/js";
import { Info, Settings, Folder } from "@mui/icons-material";
import Icon from '@mdi/react';
import SideNavBarElement from "./sideNavBarElement";

import '../../../../../res/css/NavBar.css';

/**
 * Computer side navigation bar props
 */
interface ComputerSideNavProps {
    /**
     * Update the selected item index
     * @param {number} newID newly selected item from the navigation bar
     * @returns {void}
     */
    updateSelectedID: (newID: number) => void

    /**
     * Index of the selectedItem
     */
    selectedID: number
}

/**
 * Computer side navigation bar
 * @param {ComputerSideNavProps} props Props passed from the page
 * @returns {React.JSX.Element} Navigation bar view component
 */
export default function ComputeSideNavBar (props: ComputerSideNavProps): React.JSX.Element {
    return (
        <div id="computerSideNav">
            <SideNavBarElement
                componentPath=""
                navBarLabel="Main informations"
                classId="mainInformations"
                image={
                    <Info style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        color: 'black'
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
                            verticalAlign: "middle",
                            color: 'black'
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
                            verticalAlign: "middle",
                            color: 'black'
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
                            verticalAlign: "middle",
                            color: 'black'
                        }}
                    />
                }
                id={3}
                updateSelectedNumber={() => { props.updateSelectedID(3) }}
                selectedElement={props.selectedID} />
        </div>
    )
}
