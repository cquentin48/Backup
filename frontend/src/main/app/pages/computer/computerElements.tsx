import React from "react";
import type Computer from "../../model/computer";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Folder, Info, Settings } from "@mui/icons-material";
import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';
import MainInfosFrame from "../../widget/computer/mainInfos";

interface ComputerElementProps {
    computer: Computer
}

export default function ComputerElements (props: ComputerElementProps): JSX.Element {
    const [values, setValue] = React.useState(0);
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
}
