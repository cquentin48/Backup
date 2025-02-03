import React from "react";

import Icon from "@mdi/react";
import { mdiCpu64Bit, mdiCalendarPlusOutline, mdiCalendarSync } from "@mdi/js";

import { Memory, Storage } from "@mui/icons-material";
import { Avatar, Card, CardContent, CardHeader, Grid2 } from "@mui/material";

import type Computer from "../../../../model/computer/computer";
import '../../../../../res/css/ComputerMainInfos.css';

/**
 * Device selected for the main informations display
 */
interface AccordionMainInfosProps {
    computer: Computer
}

/**
 * Accordion containing the device main informations
 * @param {AccordionMainInfosProps} props computer linked to the widget
 * @returns {React.JSX.Element} Accordion with the device main informations
 */
export default function MainInfos (props: AccordionMainInfosProps): JSX.Element {
    const computer = props.computer;

    return (
        <div>
            <Grid2 container spacing={2} sx={{ padding: "0em 1em 0em 1em" }}>
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
                                    day: "numeric"
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
                                    day: "numeric"
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
        </div>
    )
}
