import React from "react";

import { mdiBookOutline, mdiFileCogOutline, mdiFileOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { ExpandMore } from "@mui/icons-material";
import { PieChart } from "@mui/x-charts";
import { Accordion, AccordionSummary, Grid2, Paper } from "@mui/material";

import '../../../../res/css/ComputerMainInfos.css';
import SoftwareOrigins from "./charts/SoftwareOrigins";
import FilesTypes from "./charts/FilesTypes";

/**
 * Accordion displaying the formats (software and libraries) inside pie charts
 * @returns JSX.Element Accordion widget with the pie charts
 */
export default function AccordionFormats(): JSX.Element {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="types-content"
                id="types-conent-header"
            >
                <div className="deviceInfosMainHeader">
                    <Icon path={mdiFileCogOutline} style={{
                        width:'40px'
                    }}/>
                    <span style={{
                        fontSize: '26px'
                    }}>
                        Files & types formats
                    </span>
                </div>
            </AccordionSummary>
            <Grid2 container spacing={2} sx={{ padding: '1em' }}>
                <Grid2 size={6}>
                    <SoftwareOrigins/>
                </Grid2>
                <Grid2 size={6}>
                    <FilesTypes/>
                </Grid2>
            </Grid2>
        </Accordion>
    )
}