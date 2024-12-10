import React from "react";
import { Memory, Storage, Delete } from "@mui/icons-material"
import { Avatar, Button, Card, CardContent, CardHeader, Grid2, Tooltip, Typography } from "@mui/material"
import Icon from '@mdi/react';
import {
    mdiCpu64Bit,
    mdiMicrosoftWindows,
    mdiUbuntu,
    mdiCalendarSync,
    mdiCalendarPlusOutline
} from '@mdi/js';
import type Computer from "../../model/computer"

/**
 * Props interface for the computer main information display component class
 */
interface ComputerMainInfosProps {
    // TODO : put them inside a class
    computer: Computer
}

/**
 * Computer main informations display component class
 */
export default class ComputerMainInfos extends React.Component<ComputerMainInfosProps> {
    /**
     * Fetch the correct icon from the mdi labs
     * @param os
     * @returns string
     */
    getOSIcon (os: string): string {
        if (os.toLowerCase().includes("ubuntu")) {
            return mdiUbuntu;
        } else {
            return mdiMicrosoftWindows;
        }
    }

    render (): React.ReactNode {
        const computer = this.props.computer;
        return (
            <div id="computerMainInfos" style={{
                marginTop: "16px"
            }}>
                <div id="computerMainInfosHeader" style={{
                    display: "flex"
                }}>
                    {/*
                    Computer specs
                    */}
                    <div id="computerName" style={{
                        textAlign: "left",
                        paddingLeft: "12px",
                        alignItems: "center",
                        display: "flex"
                    }}>
                        <Tooltip title={computer.operatingSystem} placement='top'>
                            <Icon path={this.getOSIcon(this.props.computer.operatingSystem)} size={2} />
                        </Tooltip>
                        <Typography variant="h4">
                            {computer.name}
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        sx={{
                            marginLeft: "auto",
                            paddingRight: "-160px",
                            marginRight: "16px"
                        }}
                    >
                        Delete device data
                    </Button>
                </div>
                <br />
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
                                {"Date here"}
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
                                {"Date here"}
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
}
