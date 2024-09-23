import React from "react";
import { CalendarMonth, CalendarToday, Microsoft, Memory, Storage, Delete } from "@mui/icons-material"
import { Avatar, Button, Card, CardContent, CardHeader, Grid2, Tooltip } from "@mui/material"
import type Computer from "../../model/computer"

interface ComputerMainInfosProps {
    // TODO : put them inside a class
    computer: Computer

}

export default function ComputerMainInfos (props: ComputerMainInfosProps): JSX.Element {
    const computer = props.computer;
    let coresLabel;
    if (computer.cores > 1) {
        coresLabel = "cores"
    } else {
        coresLabel = "core"
    }
    // TODO : put elements left aligned and horizontally aligned with their icons ; put the computer name at the top (bigger text size)
    return (
        <div>
            {/*
            Computer specs
        */}
            <div id="computerMainInfos" style={{ display: "inline-block" }}>
                <div id="computerName">
                    <Tooltip title={computer.operatingSystem} placement='top'><Microsoft /></Tooltip> {computer.name}
                </div>
            </div>
            <Button variant="contained" color="error" startIcon={<Delete/>}>Delete device data</Button>
            <br />
            <Grid2 container spacing={2} sx={{ padding: "1em" }}>
                <Grid2 size={{ md: 2 }}>
                    <Card>
                        <CardHeader avatar={
                            <Avatar>
                                <Memory />
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
                    <Card>
                        <CardHeader avatar={
                            <Avatar>
                                <Memory />
                            </Avatar>
                        }
                        title="Computer cores"
                        />
                        <CardContent>
                            {computer.cores} {coresLabel}
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ md: 2 }}>
                    <Card>
                        <CardHeader avatar={
                            <Avatar>
                                <Storage />
                            </Avatar>
                        }
                        title="Processor"
                        />
                        <CardContent>
                            {computer.formatBytes(computer.memory)} RAM used
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ md: 2 }}>
                    <Card>
                        <CardHeader avatar={
                            <Avatar>
                                <CalendarMonth />
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
                    <Card>
                        <CardHeader avatar={
                            <Avatar>
                                <CalendarToday />
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
                    <Card>
                        <CardHeader avatar={
                            <Avatar>
                                <Storage />
                            </Avatar>
                        }
                        title="Storage"
                        />
                        <CardContent>
                            {"Amount of storage here"} used in storage
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </div>
    )
}
