import React from "react";

import { mdiFileOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader } from "@mui/material";
import { PieChart, type PieSeriesType, type PieValueType } from "@mui/x-charts";

import '../../../../../../res/css/ComputerMainInfos.css';
import { type MakeOptional } from "@mui/x-charts/internals";
import Device from "../../../../../model/device/device";

/**
 * Types of files passed from the chart
 */
interface FilesTypesProps {
    /**
     * If the device has been loaded
     */
    device: Device
}

/**
 *  Files types pie chart view component
 *  @returns {React.JSX.Element} View component
 *  @param {FilesTypesProps} props If the device has been loaded function
 */
export default function FilesTypes (props: FilesTypesProps): React.JSX.Element {
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
                title="Types of files"
            />
            <CardContent>
                <PieChart
                    loading={props.device === undefined}
                    series={series}
                    width={550}
                    height={200}
                    className="DisplayedPieChart"
                />
            </CardContent>
        </Card>
    )
}
