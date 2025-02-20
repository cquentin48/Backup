import React from "react";

import { type JSX } from "react";

import { Paper } from "@mui/material";
import type Device from "../../../../../model/device/device";
import { addFilter } from "../../../../controller/deviceMainInfos/addFilter";
import { removeDeviceMainInfosFilter } from "../../../../controller/deviceMainInfos/removeFilters";
import { type FilterRow } from "../../../../model/filters/FilterManager";
import DeviceMainInfosTable from "./table";

/**
 * State of the filter table
 */
interface FilterTableState {
    rows: UpdateRow[]
}

/**
 * Device loaded boolean passed from the Formats components
 */
interface FilterTableProps {
    /**
     * If the device has been loaded
     */
    device: Device
}

/**
 * Deleted filter row interface
 */
interface DeleteRow {
    /**
     * Row id of the filter in the datagrid
     */
    id: number

    /**
     * Row update action (``delete`` here)
     */
    _action?: 'delete'
}

/**
 * Update row type used for the row update transaction
 */
type UpdateRow = DeleteRow | FilterRow;

/**
 * Table displaying the filters used to displays selected informations
 * in the device main informations page.
 * @implements {React.Component<{}, FilterTableState>}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export default class FilterTable extends React.Component<FilterTableProps, FilterTableState> {

    /**
     * Component constructor class
     * @param {{}} props elements passed from the filter web component
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor (props: FilterTableProps) {
        super(props);
        this.state = {
            rows: []
        }

        addFilter.addObservable("mainDeviceInfosFilterTable", this.updateRows)
        removeDeviceMainInfosFilter.addObservable("mainDeviceInfosFilterTable", this.updateRows)
    }

    /**
     * Between the update filter list and the current filter list, compute
     * the differences done.
     * @param { FilterRow[] } currentRows Current filter list set in the datagrid
     * @param { FilterRow[] } newRows New filter list computed in the recently done operation
     * @returns {UpdateRow[]} Row updated list ready for the transaction
     */
    getDiffElements (currentRows: FilterRow[], newRows: FilterRow[]): UpdateRow[] {
        const updatedRows: UpdateRow[] = [];
        // Fetch the deleted rows
        currentRows.forEach((currentRow: FilterRow, index: number) => {
            const hasRowBeenDeleted = newRows.find(
                (newRow: FilterRow) => { return newRow === currentRow })
            if ((hasRowBeenDeleted == null) === undefined) {
                updatedRows.push({ id: index, _action: 'delete' })
            }
        })

        // Fetch the created rows
        newRows.forEach((newRow: FilterRow, index: number) => {
            const hasRowBeenCreated = currentRows.find(
                (currentRow: FilterRow) => { return newRow === currentRow });
            if (hasRowBeenCreated === undefined) {
                updatedRows.push({
                    id: index,
                    comparisonType: newRow.comparisonType,
                    fieldName: newRow.fieldName,
                    elementType: newRow.elementType,
                    value: newRow.value
                })
            }
        })
        return updatedRows;
    }

    /**
     * Update rows method callback
     * @param {string} newRows Updated rows list for the datagrid
     */
    updateRows = (newRows: string): void => {
        const rows = JSON.parse(newRows) as FilterRow[]
        const updatedElements = this.getDiffElements(rows, JSON.parse(newRows) as FilterRow[]);
        this.setState({
            rows: updatedElements
        })
    }

    /**
     * Destruction of the table component lifecycle triggered method
     */
    componentWillUnmount (): void {
        addFilter.removeObservable("mainDeviceInfosFilterTable")
        removeDeviceMainInfosFilter.removeObservable("mainDeviceInfosFilterTable")
    }

    /**
     * Table displaying the filters used to displays selected informations
     * in the device main informations page.
     * @returns {JSX.Element} Web component
     */
    render (): JSX.Element {
        const state = this.state;
        return (
            <Paper className="FilterTable">
                <DeviceMainInfosTable
                    rows={state.rows}
                    getDiffElement={this.getDiffElements}
                />
            </Paper>
        )
    }
}
