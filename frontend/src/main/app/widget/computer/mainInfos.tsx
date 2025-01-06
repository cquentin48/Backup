import React from "react";
import type Computer from "../../model/computer/computer";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

interface MainInfosFrameProps {
    computer: Computer
}

export default function MainInfosFrame (props: MainInfosFrameProps): JSX.Element {
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent): void => {
        setAge(event.target.value);
    };

    return (
        <div>
            <div
                id="mainInfosTableSelectHeader"
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "16px",
                    marginRight: "16px",
                    padding: "8px",
                    backgroundColor: "#c2c2c2",
                    borderRadius: "6.25px"
                }}
            >
                <Icon path={mdiClockOutline} size={1} />

                Updated on the {/* add the last update here! */}

                <FormControl sx={{
                    minWidth: "256px",
                    maxWidth: "512px"
                }}>
                    <InputLabel id="updateTime">Age</InputLabel>
                    <Select
                        labelId="updateTime-label"
                        id="updateTime-select"
                        value={age}
                        label="Age"
                        onChange={handleChange}
                    >
                        {/* Add here the list with the updates */}
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{
                    minWidth: "256px",
                    maxWidth: "512px"
                }}>
                    <InputLabel id="dataType">Type of data</InputLabel>
                    <Select
                        labelId="dataType-label"
                        id="dataType-select"
                        value={age}
                        label="Age"
                        onChange={handleChange}
                        autoWidth
                    >
                        {/* Add here the list with the updates */}
                        <MenuItem value={10}><Icon path={mdiClockOutline} size={1} />Librairies</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div id="mainInfosLibraryPieChart"
                style={{
                    marginLeft: "16px",
                    marginRight: "16px",
                    padding: "8px",
                    backgroundColor: "#c2c2c2",
                    borderRadius: "6.25px"
                }}
            >
                Actuellement il y a 16 librairies stockées dans 6 types :
                <br/>
                {/* Display here the libraries */}
            </div>
        </div>
    );
}
