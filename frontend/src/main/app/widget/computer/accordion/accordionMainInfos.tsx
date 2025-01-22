import React from "react";

import Icon from "@mdi/react";
import { mdiCpu64Bit, mdiCalendarPlusOutline, mdiCalendarSync, mdiBookCogOutline } from "@mdi/js";

import { ExpandMore, Memory, Storage } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, CardContent, CardHeader, Grid2 } from "@mui/material";

import Computer from "../../../model/computer/computer";

/**
 * Device selected for the main informations display
 */
interface AccordionMainInfosProps {
    computer: Computer
}

/**
 * Accordion containing the device main informations
 * @param props computer linked to the widget
 * @returns Accordion with the device main informations
 */
export default function AccordionMainInfos(props: AccordionMainInfosProps): JSX.Element {
    const computer = props.computer;

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="mainInfos-content"
                id="mainInfos-header"
            >
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: 'center'
                }}>
                    <Icon path={mdiBookCogOutline} style={{width:'40px'}}/>
                    <span style={{
                        fontSize: '26px'
                    }}>
                        Device main informations
                    </span>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <Grid2 container spacing={2} sx={{ padding: "1em" }}>
                    <Grid2 size={{ md: 2 }}>
                        <Card sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <CardHeader avatar={
                                <Avatar>
                                    <Icon path={mdiCpu64Bit} size={1} />
                                </Avatar>
                            }
                                title="Processor"
                            />
                            <CardContent>
                                {computer.processor}
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ md: 2 }}>
                        <Card sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <CardHeader avatar={
                                <Avatar>
                                    <Memory />
                                </Avatar>
                            }
                                title="Computer cores"
                            />
                            <CardContent>
                                {computer.cores}
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ md: 2 }}>
                        <Card sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <CardHeader avatar={
                                <Avatar>
                                    <Storage />
                                </Avatar>
                            }
                                title="RAM"
                            />
                            <CardContent>
                                {computer.formatBytes(computer.memory)} RAM in total
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ md: 2 }}>
                        <Card sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <CardHeader avatar={
                                <Avatar>
                                    <Icon path={mdiCalendarPlusOutline} size={1} />
                                </Avatar>
                            }
                                title="Device added on"
                            />
                            <CardContent>
                                {
                                    computer.snapshots[0]?.uploadDate.toLocaleDateString(window.navigator.language, {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                }
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ md: 2 }}>
                        <Card sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <CardHeader avatar={
                                <Avatar>
                                    <Icon path={mdiCalendarSync} size={1} />
                                </Avatar>
                            }
                                title="Last Update"
                            />
                            <CardContent>
                                {
                                    computer.snapshots[0]?.uploadDate.toLocaleDateString(window.navigator.language, {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ md: 2 }}>
                        <Card sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <CardHeader avatar={
                                <Avatar>
                                    <Storage />
                                </Avatar>
                            }
                                title="Storage"
                            />
                            <CardContent>
                                {"Amount of storage here"} used in the backup server {/* Replace it */}
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </AccordionDetails>
        </Accordion>
    )
}