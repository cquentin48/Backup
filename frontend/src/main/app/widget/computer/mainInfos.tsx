import React from "react";
import type Computer from "../../model/computer/computer";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Grid2, rgbToHex, Paper } from "@mui/material";

import AccordionFormats from "./accordion/accordionFormats";
import AccordionMainInfos from "./accordion/accordionMainInfos";
import '../../../res/css/ComputerMainInfos.css';

interface MainInfosFrameProps {
    computer: Computer
}

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
                                    <MenuItem value={snapshot?.id}>{snapshot?.localizedUploadDate()}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            <Paper elevation={2} sx={{
                backgroundColor: '#c2c2c2',
                marginTop: '16px'
            }}>
                <Grid2 spacing={2}>
                    <AccordionMainInfos computer={props.computer} />
                    <AccordionFormats />
                </Grid2>
            </Paper>
        </div>
    );
}
