/* eslint @typescript-eslint/ban-types: 0 */
import React from "react";

import { Grid2 } from "@mui/material";

import '../../../../../res/css/ComputerMainInfos.css';
import SoftwareOrigins from "./charts/SoftwareOrigins";
import FilesTypes from "./charts/FilesTypes";
import FilterTable from "./filters/table";

interface FormatsProps {
    deviceLoaded: boolean
}

/**
 * Accordion displaying the formats (software and libraries) inside pie charts
 */
export default class Formats extends React.Component<FormatsProps> {

    /**
     * Render the component
     * @returns {React.JSX.Element} Accordion displaying the file formats and libraries types
     */
    render (): React.JSX.Element {
        const { deviceLoaded } = this.props;

        return (
            <div className="DeviceMainInfos">
                <FilterTable deviceLoaded={deviceLoaded} />
                <Grid2 container spacing={2} id="pieCharts">
                    <Grid2 size={6}>
                        <SoftwareOrigins />
                    </Grid2>
                    <Grid2 size={6}>
                        <FilesTypes deviceLoaded={this.props.deviceLoaded}/>
                    </Grid2>
                </Grid2>
            </div>
        )
    }
}
