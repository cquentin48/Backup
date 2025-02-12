import React from "react";

import { mdiBookOutline, mdiFilterOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { PieChart } from "@mui/x-charts";

import '../../../../../../res/css/ComputerMainInfos.css';
import { dataManager } from "../../../../../model/AppDataManager";
import { type SnapshotData } from "../../../../../model/snapshot/snapshotData";
import { loadSnapshot } from "../../../../controller/deviceMainInfos/loadSnapshot";

interface SoftwareOriginsState {
    /**
     * Pie chart series data for the chart display
     */
    data: PieChartData[]
}

/**
 * Pie chart series data
 */
interface PieChartData {
    /**
     * Data index key
     */
    id: number

    /**
     * Data value
     */
    value: number

    /**
     * Data label
     */
    label: string
}

/**
 *  Sofware Origins pie charts view component
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export default class SoftwareOrigins extends React.Component<{}, SoftwareOriginsState> {
    state: Readonly<SoftwareOriginsState> = {
        data: []
    };

    componentDidMount (): void {
        loadSnapshot.addObservable("mainDeviceInfosSoftwareInfosPieChart", this.updatePieChartData)
    }

    /**
     * Update pie chart series data
     * @param {string} data Updated pie chart series
     */
    updatePieChartData = (data: string): void => {
        const snapshot = (
            JSON.parse(dataManager.getElement("snapshot")) as SnapshotData
        ).softwares
        const rawSeries = new Map<string, number>();
        snapshot.forEach((singleVersion) => {
            const softwareInstallType = singleVersion.softwareInstallType
            if (!rawSeries.has(softwareInstallType)) {
                rawSeries.set(softwareInstallType, 1)
            } else {
                const previousValue = rawSeries.get(softwareInstallType) as number
                rawSeries.set(softwareInstallType, previousValue + 1)
            }
        });
        let series = Array.from(
            new Map([...rawSeries.entries()].sort((a, b) => a[1] - b[1])),
            ([label, value], index) => ({ label, value, id: index })
        )
        if (series.length >= 7) {
            const other = series.slice(5).reduce((a, b) => {
                return {
                    id: 6,
                    value: a.value + b.value,
                    label: "Other"
                }
            })
            const filteredArray = series.filter((series) => {
                return series.id < 5
            })
            filteredArray.push(other)
            series = filteredArray
        }
        this.setState({
            data: series
        })
    }

    /**
     * Component DOM rendering method
     * @returns {React.JSX.Element} View component
     */
    render (): React.JSX.Element {
        const state = this.state;
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
                        <IconButton aria-label="settings">
                            <Icon path={mdiFilterOutline} size={1} />
                        </IconButton>
                    }
                />
                <CardContent>
                    <PieChart
                        series={[
                            {
                                data: state.data.map((element, index) => {
                                    return { id: index, value: element.value, label: element.label }
                                })
                            }
                        ]}
                        loading={state.data.length === 0}
                        width={550}
                        height={200}
                        className="DisplayedPieChart"
                    />
                </CardContent>
            </Card>
        )
    }
}
