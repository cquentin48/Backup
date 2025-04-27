/* eslint @typescript-eslint/ban-types: 0 */
import React from "react";

import { Grid2 } from "@mui/material";

import SoftwareOrigins from "./charts/SoftwareOrigins";
import FilesTypes from "./charts/FilesTypes";
import FilterTable from "./filters/table";

import '../../../../../res/css/ComputerMainInfos.css';

/**
 * Accordion displaying the formats (software and libraries) inside pie charts
 * @returns {React.JSX.Element} Rendered component
 */
export default function FormatsPieCharts (): React.JSX.Element {
    return (
        <div className="DeviceMainInfos">
            <FilterTable />
            <Grid2 container spacing={2} id="pieCharts">
                <Grid2 size={6}>
                    <SoftwareOrigins />
                </Grid2>
                <Grid2 size={6}>
                    <FilesTypes />
                </Grid2>
            </Grid2>
        </div>
    )
}
