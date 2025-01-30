import React from "react";

import { mdiBookOutline, mdiFilterOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { PieChart } from "@mui/x-charts";

import '../../../../../../res/css/ComputerMainInfos.css';

/**
 *  Sofware Origins pie charts view component
 *  @returns {React.JSX.Element} View component
 */
export default function SoftwareOrigins (): React.JSX.Element {
    return (
        <Card className="PieChartCard">
            <CardHeader
                avatar={
                    <Avatar
                        sx={{ bgcolor: "#c2c2c2" }}
                        arial-labels="recipe">
                        <Icon path={mdiBookOutline} size={1} />
                    </Avatar>
                }
                title="Software origins"
                action={
                    <IconButton aria-label="settings" onClick={
                        () => {
                            console.log("Filter software origin display")
                        }
                    }>
                        <Icon path={mdiFilterOutline} size={1} />
                    </IconButton>
                }
            />
            <CardContent>
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: 150, label: "APT" },
                                { id: 1, value: 20, label: "Snapcraft" }
                            ]
                        }
                    ]}
                    width={550}
                    height={200}
                    className="DisplayedPieChart"
                />
            </CardContent>
        </Card>
    )
}
