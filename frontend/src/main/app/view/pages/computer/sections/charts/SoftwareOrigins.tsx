import React from "react";

import { mdiBookOutline, mdiFilterOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { PieChart } from "@mui/x-charts";

import { dataManager } from "../../../../../model/AppDataManager";
import NotImplementedError from "../../../../../model/exception/errors/notImplementedError";
import { type SnapshotData } from "../../../../../model/snapshot/snapshotData";
import { SnapshotSoftware } from "../../../../../model/snapshot/snapshotLibrary";
import { type FilterComparisonType } from "../../../../model/filters/Filter";
import type Filter from "../../../../model/filters/Filter";

import '../../../../../../res/css/ComputerMainInfos.css';
import { useSelector } from "react-redux";
import { AppState as AppDataState } from "../../../../controller/store";
import { FilterRow } from "../../../../model/filters/FilterManager";

interface SoftwareOriginsState {
    /**
     * Pie chart series data for the chart display
     */
    data: PieChartData[]

    filteredSoftwares: SnapshotSoftware[] | undefined
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
export default function SoftwareOrigins (): React.JSX.Element {
    const [data, setData] = React.useState<PieChartData[]>([]);

    const filters = useSelector((state: AppDataState) => state.filters.filters)

    const [filteredSoftwares, setFilteredSoftwares] = React.useState<SnapshotSoftware[] | undefined>([]);

    /**
     * Fetch the filtered software from the state
     * @returns {SnapshotSoftware[]} Filtered | all softwares
     */
    const getSoftwares = (): SnapshotSoftware[] => {
        let softwares;
        if (filteredSoftwares === undefined) {
            softwares = (
                JSON.parse(dataManager.getElement("snapshot")) as SnapshotData
            ).softwares
        } else {
            softwares = filteredSoftwares
        }
        return softwares
    }

    /**
     * Apply filter on the software list
     * @param {SnapshotSoftware[]} softwares Software list where they will filtered with the conditions set
     * @param {object} value Value for the filter to be applied on
     * @param {FilterComparisonType} operator Type of condition (e.g. ``<`` or ``!=``)
     * @param {string} fieldName Name of the field for the condition (e.g. ``name``)
     * @returns {SnapshotSoftware[]} Software with the condition applied on
     */
    const applyFilterOn = (softwares: SnapshotSoftware[], value: object, operator: FilterComparisonType, fieldName: string): SnapshotSoftware[] => {
        switch (operator) {
            case "!=":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] !== value)
                })
            case "<":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] < value)
                })

            case "<=":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] <= value)
                })
            case ">":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] > value)
                })
            case ">=":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] >= value)
                })
            case "==":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] === value)
                })
            case "includes":
                return softwares.filter((software) => {
                    return (((software as any)[fieldName] as string).includes(value as unknown as string))
                })
        }
    }

    /**
     * Update pie chart series data
     * @param {string} softwareData Pie chart series data (first-time load)
     */
    const initPieChartData = (softwareData: string = ""): void => {
        const softwares = getSoftwares()
        const rawSeries = new Map<string, number>();
        softwares.forEach((singleVersion) => {
            const softwareInstallType = singleVersion.installType
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
        setData(series)
    }

    const updatePieChartData = (filters: FilterRow[]): void => {
        let softwares = (
            JSON.parse(dataManager.getElement("snapshot")) as SnapshotData
        ).softwares
        filters.forEach((filter) => {
            switch (filter.fieldName) {
                case "name":
                case "version":
                    softwares = applyFilterOn(softwares, filter.value, filter.comparisonType, filter.fieldName)
                    break;
                case "firstUploadDate":
                case "lastUploadDate":
                case "repository":
                case "size":
                    throw new NotImplementedError("Not implemented yet!")
                default:
                    throw new NotImplementedError("Unknown operation type!")
            }
        })
        setFilteredSoftwares(softwares)
        initPieChartData()
    }

    updatePieChartData(filters)

    return (
        <Card className="PieChartCard">
            <CardHeader
                avatar={
                    <Avatar
                        className="PieChartIcon"
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
                            data: data.map((element, index) => {
                                return { id: index, value: element.value, label: element.label }
                            })
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