/* eslint @typescript-eslint/ban-types: 0 */
import React from "react";

import { Grid2 } from "@mui/material";

import SoftwareOrigins from "./charts/SoftwareOrigins";
import FilesTypes from "./charts/FilesTypes";
import FilterTable from "./filters/cardTable";
import type Device from "../../../../model/device/device";

import '../../../../../res/css/ComputerMainInfos.css';

interface FormatsProps {
    device: Device
}

/**
 * Accordion displaying the formats (software and libraries) inside pie charts
 * @param {FormatsProps} props Loaded device from the device page component
 * @returns {React.JSX.Element} Accordion displaying the file formats and libraries types
 */
export default function FormatsPieCharts (props: FormatsProps): React.JSX.Element {

    /**
     * Render the component
     */
    return (
        <div className="DeviceMainInfos">
            <FilterTable device={props.device} />
            <Grid2 container spacing={2} id="pieCharts">
                <Grid2 size={6}>
                    <SoftwareOrigins />
                </Grid2>
                <Grid2 size={6}>
                    <FilesTypes device={props.device} />
                </Grid2>
            </Grid2>
        </div>
    )
}
