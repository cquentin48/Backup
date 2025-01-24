import { mdiFileOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import React from "react";

export default function FilesTypes() {
    return (
        <Card sx={{ width: "fit-content" }}>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{ bgcolor: "#c2c2c2" }}
                        arial-labels="recipe">
                        <Icon path={mdiFileOutline} size={1} />
                    </Avatar>
                }
                title="Types of files"
            />
            <CardContent>
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
                    width={550}
                    height={200}
                    className="DisplayedPieChart"
                />
            </CardContent>
        </Card>
    )
}