/* eslint @typescript-eslint/ban-types: 0 */
import React from "react";

import { Grid2 } from "@mui/material";

import '../../../../../res/css/ComputerMainInfos.css';
import SoftwareOrigins from "./charts/SoftwareOrigins";
import FilesTypes from "./charts/FilesTypes";
import FilterTable from "./filters/table";
import Device from "../../../../model/device/device";

interface FormatsProps{
    device: Device;
}

/**
 * Accordion displaying the formats (software and libraries) inside pie charts
 * @returns {React.JSX.Element} Accordion displaying the file formats and libraries types
 */
export default function Formats (props: FormatsProps) {

    /**
     * Render the component
     */
    return (
        <div className="DeviceMainInfos">
            <FilterTable device={props.device}/>
            <Grid2 container spacing={2} id="pieCharts">
                <Grid2 size={6}>
                    <SoftwareOrigins />
                </Grid2>
                <Grid2 size={6}>
                    <FilesTypes device={props.device}/>
                </Grid2>
            </Grid2>
        </div>
    )
}
