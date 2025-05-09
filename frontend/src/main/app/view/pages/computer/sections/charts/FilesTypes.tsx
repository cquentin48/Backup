import React from "react";

import { mdiFileOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { PieChart, type PieSeriesType, type PieValueType } from "@mui/x-charts";
import { type MakeOptional } from "@mui/x-charts/internals";

import { useSelector } from "react-redux";

import { snapshotState } from "../../../../../controller/deviceMainInfos/loadSnapshotSlice";
import '../../../../../../res/css/ComputerMainInfos.css';

/**
 *  Files types pie chart view component
 *  @returns {React.JSX.Element} View component
 */
export default function FilesTypes (): React.JSX.Element {
    const { snapshot, operationStatus } = useSelector(snapshotState)
    const series: Array<MakeOptional<PieSeriesType<MakeOptional<PieValueType, "id">>, "type">> = [
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
    ]
    return (
        <Card className="PieChartCard">
            <CardHeader
                avatar={
                    <Avatar
                        className="AvatarIcon"
                        arial-labels="recipe">
                        <Icon path={mdiFileOutline} size={1} />
                    </Avatar>
                }
                title={
                    <Typography variant="h5">
                        Types of files
                    </Typography>
                }
            />
            <CardContent>
                <PieChart
                    loading={operationStatus === "initial" || operationStatus === "loading" || snapshot === undefined}
                    series={snapshot !== undefined ? series : [{ data: [] }]}
                    width={550}
                    height={200}
                    className="DisplayedPieChart"
                />
            </CardContent>
        </Card>
    )
}
