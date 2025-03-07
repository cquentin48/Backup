import React, { useEffect, useMemo } from "react";

import { mdiCodeNotEqualVariant } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";

import { useSelector } from "react-redux";

import { SnapshotData } from "../../../../../model/snapshot/snapshotData";
import { type SnapshotSoftware } from "../../../../../model/snapshot/snapshotLibrary";

import '../../../../../../res/css/ComputerMainInfos.css';

import type Filter from "../../../../../model/filters/Filter";

import { snapshotState } from "../../../../../controller/deviceMainInfos/loadSnapshotSlice";
import { deviceMainInfosFilterState } from "../../../../../controller/deviceMainInfos/filterSlice";

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
 * Sofware Origins pie charts view component
 * @returns {React.JSX.Element} rendered component
 */
export default function SoftwareOrigins (): React.JSX.Element {
    const [data, setData] = React.useState<PieChartData[]>([]);

    const { snapshot, snapshotError, operationStatus } = useSelector(snapshotState)

    const { filters } = useSelector(deviceMainInfosFilterState)

    const memoSnapshot = useMemo(() => snapshot, [snapshot])
    const memoFilter = useMemo(() => {
        return filters
    }, [filters])

    /**
     * Update pie chart series data
     * @param {SnapshotSoftware[]} filteredSoftwares softwares with the filters applied on
     */
    const initPieChartData = (filteredSoftwares: SnapshotSoftware[]): void => {
        const rawSeries = new Map<string, number>();
        (filteredSoftwares).forEach((singleVersion) => {
            const softwareInstallType = singleVersion.installType
            if (!rawSeries.has(softwareInstallType)) {
                rawSeries.set(softwareInstallType, 1)
            } else {
                const previousValue = rawSeries.get(softwareInstallType) as number
                rawSeries.set(softwareInstallType, previousValue + 1)
            }
        });
        const sorterdArray = new Map([...rawSeries.entries()].sort((a, b) => a[1] - b[1]))
        let series = Array.from(
            sorterdArray,
            ([label, value], index) => (
                {
                    label,
                    value,
                    id: index
                }
            )
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
        setData(series)
    }

    /**
     * Updates chart data based off the filters set by the user
     * @param {Filter} filters Filters set by the user
     */
    const updatePieChartData = (filters: Filter[]): void => {
        const softwaresFilter = filters.filter((filter) =>
            filter.elementType === "Library"
        )
        const softwares = SnapshotData.fetchFilteredSoftwares((memoSnapshot as SnapshotData), softwaresFilter)
        initPieChartData(softwares)
    }

    useEffect(() => {
        if (!(operationStatus === "initial" || operationStatus === "loading") && snapshotError.message === "" && snapshot !== undefined) {
            updatePieChartData(memoFilter)
        }
    }, [operationStatus])

    if (snapshotError.message === "") {
        return (
            <Card className="PieChartCard">
                <CardHeader
                    avatar={
                        <Avatar
                            className="PieChartIcon"
                            arial-labels="recipe">
                            <Icon path={mdiCodeNotEqualVariant} size={1} />
                        </Avatar>
                    }
                    title={
                        <Typography variant="h5">
                            Software origins
                        </Typography>
                    }
                />
                <CardContent>
                    <PieChart
                        loading={operationStatus === "loading" || operationStatus === "initial" || snapshot === undefined}
                        series={snapshot === undefined ? [{ data: [] }] : [{ data }]}
                        width={550}
                        height={200}
                        className="DisplayedPieChart"
                    />
                </CardContent>
            </Card>
        )
    } else {
        return (
            <Card className="PieChartCard">
                <CardHeader
                    avatar={
                        <Avatar
                            className="PieChartIcon"
                            arial-labels="recipe">
                            <Icon path={mdiCodeNotEqualVariant} size={1} />
                        </Avatar>
                    }
                    title={
                        <Typography variant="h5">
                            Software origins - error
                        </Typography>
                    }
                />
                <CardContent>
                    The softwares origins chart could not be loaded!
                    <br />
                    If the problem occurs frequently, please send an email to you admin!
                </CardContent>
            </Card>
        )
    }
}
