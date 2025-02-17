import React from "react";

import { mdiBookOutline, mdiFilterOutline } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { PieChart } from "@mui/x-charts";

import '../../../../../../res/css/ComputerMainInfos.css';
import { dataManager } from "../../../../../model/AppDataManager";
import NotImplementedError from "../../../../../model/exception/errors/notImplementedError";
import { SnapshotData } from "../../../../../model/snapshot/snapshotData";
import { SnapshotSoftware } from "../../../../../model/snapshot/snapshotLibrary";
import { addFilter } from "../../../../controller/deviceMainInfos/addFilter";
import { loadSnapshot } from "../../../../controller/deviceMainInfos/loadSnapshot";
import { FilterComparisonType } from "../../../../model/filters/Filter";
import { filterManager } from "../../../../model/filters/FilterManager";

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
export default class SoftwareOrigins extends React.Component<{}, SoftwareOriginsState> {
    state: Readonly<SoftwareOriginsState> = {
        data: [],
        filteredSoftwares: undefined
    };

    componentDidMount (): void {
        loadSnapshot.addObservable("softwareInfosPieChart", this.initPieChartData)
        addFilter.addObservable("softwareInfosPieChart", this.initPieChartData)
    }

    applyFilterOn = (softwares: SnapshotSoftware[], value: object, operator: FilterComparisonType, fieldName: string): SnapshotSoftware[] => {
        switch (operator) {
            case "!=":
                return softwares.filter((software) => {
                    return ((software as any)[fieldName] != value)
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

    updatePieChartData = (filterData: string): void => {
        const filters = filterManager.softwareFilters()
        var softwares = (JSON.parse(dataManager.getElement("snapshot")) as SnapshotData).softwares
        filters.forEach((filter) => {
            switch (filter.elementType) {
                case "name":
                    softwares = this.applyFilterOn(softwares, filter.filterValue, filter.opType, filter.fieldName)
                    break;
                case "version":
                    softwares = this.applyFilterOn(softwares, filter.filterValue, filter.opType, filter.fieldName)
                    break;
                case "firstUploadDate":
                case "lastUploadDate":
                case "repository":
                case "size":
                    throw new NotImplementedError("Not implemented yet!")
            }
        })
        this.setState({
            filteredSoftwares: softwares
        })
        this.initPieChartData()
    }

    /**
     * Update pie chart series data
     * @param {string} softwareData Pie chart series data (first-time load)
     */
    initPieChartData = (softwareData: string = ""): void => {
        let softwares;
        if(this.state.filteredSoftwares === undefined){
            softwares = (
                JSON.parse(dataManager.getElement("snapshot")) as SnapshotData
            ).softwares
        }else{
            softwares = this.state.filteredSoftwares
        }
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
