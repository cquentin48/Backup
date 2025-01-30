import React from "react";
import type Computer from "../../../model/computer/computer";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Grid2, Paper } from "@mui/material";

import Formats from "./sections/Formats";
import '../../../../res/css/ComputerMainInfos.css';

/**
 * Main informations frame props interface
 */
interface MainInfosFrameProps {
    /**
     * Device selected for its main information to be displayed in the web component
     */
    computer: Computer
}

/**
 * Main informations frame view component
 * @param {MainInfosFrameProps} props Selected device passed from the {ComputerElement} view page.
 * @returns {React.JSX.Element} View component
 */
export default function MainInfosFrame(props: MainInfosFrameProps): JSX.Element {
    const [packageType, setPackageType] = React.useState('');

    const handleChange = (event: SelectChangeEvent): void => {
        setPackageType(event.target.value);
    };

    return (
        <div id="mainInfosTable">
            <div id="mainInfosTableSelectHeader">
                <Icon path={mdiClockOutline} size={1} />
                <FormControl sx={{
                    minWidth: "256px",
                    maxWidth: "512px"
                }}>
                    <InputLabel id="dataType">Save date</InputLabel>
                    <Select
                        labelId="dataType-label"
                        id="dataType-select"
                        value={packageType}
                        onChange={handleChange}
                        autoWidth
                    >
                        {/* Add here the list with the updates */}
                        <MenuItem value={10}><Icon path={mdiClockOutline} size={1} />Librairies</MenuItem>
                        {
                            props.computer.snapshots.map((snapshot, index) => {
                                return (
                                    <MenuItem key={index} value={snapshot?.id}>
                                        {snapshot?.localizedUploadDate()}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            <Paper elevation={2} id="detailsContainer">
                <Formats />
            </Paper>
        </div>
    );
}
