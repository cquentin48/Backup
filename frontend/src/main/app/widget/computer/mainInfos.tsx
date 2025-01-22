import React from "react";
import type Computer from "../../model/computer/computer";

import Icon from '@mdi/react';
import { mdiBookOutline, mdiClockOutline, mdiFileOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Paper } from "@mui/material";

import '../../../res/css/ComputerMainInfos.css';
import { PieChart } from "@mui/x-charts";

interface MainInfosFrameProps {
    computer: Computer
}

export default function MainInfosFrame (props: MainInfosFrameProps): JSX.Element {
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
                            props.computer.snapshots.map((snapshot, index) =>{
                                return(
                                    <MenuItem value={snapshot?.id}>{snapshot?.localizedUploadDate()}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            { /* Group it into accordion */}
            <div id="mainInfosFiles"
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <Paper elevation={1} sx={{height:"fit-content"}}>
                    <div>
                        <Icon path={mdiBookOutline} size={1}/>
                        Software repartitions
                    </div>
                    <PieChart
                        series={[
                            {
                                data:[
                                    {id:0, value: 150, label: "APT"},
                                    {id:1, value: 20, label: "Snapcraft"}
                                ]
                            }
                        ]}
                        width={400}
                        height={200}
                        sx={{
                            width: "fit-content",
                            flexDirection: "column",
                            display: "flex"
                        }}
                    />
                </Paper>
                <Paper elevation={1} sx={{height:"fit-content"}}>
                    <div>
                        <Icon path={mdiFileOutline} size={1}/>File repartition
                    </div>
                    <PieChart
                        series={[
                            {
                                data:[
                                    {id:0, value: 26, label: "Text/Other"},
                                    {id:1, value: 50, label: "Images"},
                                    {id:2, value: 75, label: "Videos"},
                                    {id:3, value: 155, label: "Shared Libraries"},
                                    {id:4, value: 75, label: "Music"},
                                    {id:5, value: 155, label: "Other"}
                                ]
                            }
                        ]}
                        width={600}
                        height={200}
                        sx={{
                            width: "fit-content",
                            flexDirection: "column",
                            display: "flex"
                        }}
                    />
                </Paper>
            </div>
        </div>
    );
}
