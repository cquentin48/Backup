import React from "react";
import type Computer from "../../model/computer";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Folder, Info, Memory, Settings } from "@mui/icons-material";

interface ComputerElementProps {
    computer: Computer
}

export default function ComputerElements (props: ComputerElementProps): JSX.Element {
    const [values, setValue] = React.useState(0);
    return (
        <Box>
            <BottomNavigation
                showLabels
                value={values}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Main informations" icon={<Info/>}/>
                <BottomNavigationAction label="Libraries" icon={<Memory />}/>
                <BottomNavigationAction label="Software configurations" icon={<Settings />} />
                <BottomNavigationAction label="Folder storage" icon={<Folder />} />
            </BottomNavigation>
        </Box>
    )
}
