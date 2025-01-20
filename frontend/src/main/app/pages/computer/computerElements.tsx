import React from "react";
import type Computer from "../../model/computer/computer";
import { Folder, Info, Settings } from "@mui/icons-material";
import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';
import MainInfosFrame from "../../widget/computer/mainInfos";
import SideNavBarElement from "../../widget/computer/sideNavBarElement";

import '../../../res/css/navBar.css';

interface ComputerElementProps {
    computer: Computer
}

export default function ComputerElements(props: ComputerElementProps): JSX.Element {
    const [selectedID, updateSelectedID] = React.useState(0);
    /**
    return (
        <Box>
            <MainInfosFrame computer={props.computer}/>
            <BottomNavigation
                showLabels
                value={values}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Main informations" icon={<Info/>}/>
                <BottomNavigationAction label="Libraries" icon={
                    <Icon path={mdiDatabase} size={1} />
                }/>
                <BottomNavigationAction label="Software configurations" icon={<Settings />} />
                <BottomNavigationAction label="Folder storage" icon={<Folder />} />
            </BottomNavigation>
        </Box>
    )
    */
    return (
        <div style={{
            display: "flex",
            textAlign: "left",
        }}>
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
                    updateSelectedNumber={() => { updateSelectedID(0) }}
                    selectedElement={selectedID}
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
                    updateSelectedNumber={() => { updateSelectedID(1) }}
                    selectedElement={selectedID} />
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
                    updateSelectedNumber={() => { updateSelectedID(2) }}
                    selectedElement={selectedID} />
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
                    updateSelectedNumber={() => { updateSelectedID(3) }}
                    selectedElement={selectedID} />
            </div>
            <MainInfosFrame computer={props.computer} />
        </div>
    )
}
