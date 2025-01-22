import React from "react";

import { mdiBookOutline, mdiFileCogOutline, mdiFileOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { ExpandMore } from "@mui/icons-material";
import { PieChart } from "@mui/x-charts";
import { Accordion, AccordionSummary, Grid2, Paper } from "@mui/material";

import '../../../../res/css/ComputerMainInfos.css';

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
                <div style={{
                    display:"flex",
                    flexDirection: "row",
                    alignItems: 'center'
                }}>
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
                    <Paper elevation={1} sx={{ height: "fit-content" }}>
                        <div>
                            <Icon path={mdiBookOutline} size={1} />
                            Software origins
                        </div>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: 150, label: "APT" },
                                        { id: 1, value: 20, label: "Snapcraft" }
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
                </Grid2>
                <Grid2 size={6}>
                    <Paper elevation={1} sx={{ height: "fit-content" }}>
                        <div>
                            <Icon path={mdiFileOutline} size={1} />File types
                        </div>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: 26, label: "Text/Other" },
                                        { id: 1, value: 50, label: "Images" },
                                        { id: 2, value: 75, label: "Videos" },
                                        { id: 3, value: 155, label: "Shared Libraries" },
                                        { id: 4, value: 75, label: "Music" },
                                        { id: 5, value: 155, label: "Other" }
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
                </Grid2>
            </Grid2>
        </Accordion>
    )
}