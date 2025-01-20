import React from "react";
import type Computer from "../../model/computer/computer";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

interface MainInfosFrameProps {
    computer: Computer
}

export default function MainInfosFrame (props: MainInfosFrameProps): JSX.Element {
    const [packageType, setPackageType] = React.useState('');

    const handleChange = (event: SelectChangeEvent): void => {
        setPackageType(event.target.value);
    };

    return (
        <div style={{
            flex: "auto"
        }}>
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
                    <InputLabel id="dataType">Type of data</InputLabel>
                    <Select
                        labelId="dataType-label"
                        id="dataType-select"
                        value={packageType}
                        label="Type of data"
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
            <div id="mainInfosLibraryPieChart"
                style={{
                    marginLeft: "16px",
                    marginRight: "16px",
                    padding: "8px",
                    backgroundColor: "#c2c2c2",
                    borderRadius: "6.25px"
                }}
            >
                {/* Display here the libraries */}
            </div>
        </div>
    );
}
