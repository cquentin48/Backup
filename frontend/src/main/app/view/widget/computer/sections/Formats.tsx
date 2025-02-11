/* eslint @typescript-eslint/ban-types: 0 */
import React from "react";

import { Grid2 } from "@mui/material";

import '../../../../../res/css/ComputerMainInfos.css';
import SoftwareOrigins from "./charts/SoftwareOrigins";
import FilesTypes from "./charts/FilesTypes";
import FiltersSection from "./filters/section";

/**
 * Accordion displaying the formats (software and libraries) inside pie charts
 */
export default class Formats extends React.Component {

    /**
     * Render the component
     * @returns {React.JSX.Element} Accordion displaying the file formats and libraries types
     */
    render (): React.JSX.Element {

        return (
            <div className="DeviceMainInfos">
                <FiltersSection/>
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
}
