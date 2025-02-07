import React, { createRef } from "react";

import { type JSX } from "react";

import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { FilterGridToolbar } from "./toolbar/filterGridToolbar";
import { type GridApiCommunity } from "@mui/x-data-grid/models/api/gridApiCommunity";

import { type FilterRow } from "../../../../model/filters/FilterManager";
import { addFilter } from "../../../../controller/deviceMainInfos/addFilter";
import DeviceMainInfosGridFooter from './footer/GridFooter';
import { updateDeviceMainInfosFilter } from "../../../../controller/deviceMainInfos/updateSelectedFilters";
import { removeDeviceMainInfosFilter } from "../../../../controller/deviceMainInfos/removeFilters";

/**
 * Elements passed from the filter component to this one
 */
interface FilterTableProps {
    /**
     * Filters set by the user
     */
    filters: [string?]

    /**
     * Function set to remove indexes selected by the user
     * @param indexes Indexes ticked by the user
     */
    removeSelectedIndexes: (indexes: [number]) => void
}

/**
 * Columns set for the filter table below
 */
const filterTableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 70,
        type: 'number'
    },
    {
        field: 'elementType',
        headerName: 'Element type',
        width: 150,
        description: 'If you wish to filter on files or softwares.'
    },
    {
        field: 'fieldName',
        headerName: 'Field name',
        width: 150,
        description: 'Name of the field element with the filter.'
    },
    {
        field: 'opType',
        headerName: 'Condition type',
        width: 50,
        description: 'Which operation do you wish to apply on the filter.'
    },
    {
        field: 'filterValue',
        headerName: 'Filter value',
        width: 150,
        description: 'Value where to the filter condition applies.'
    }
];

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
 * State of the filter table
 */
interface FilterTableState {
    rows: FilterRow[]
}

/**
 * Table displaying the filters used to displays selected informations
 * in the device main informations page.
 * @implements {React.Component<FilterTableProps, FilterTableState>}
 */
export default class FilterTable extends React.Component<FilterTableProps, FilterTableState> {
    /**
     * Datagrid row table manager
     */
    tableManager: React.RefObject<GridApiCommunity>;

    /**
     * Filter table web component constructor
     * @param {FilterTableProps} props elements passed from the filter web component
     */
    constructor (props: FilterTableProps) {
        super(props);
        this.state = {
            rows: []
        }

        this.tableManager = createRef() as React.RefObject<GridApiCommunity>;

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
                (newRow: FilterRow) => { return newRow === currentRow }) !== undefined
            if (!hasRowBeenDeleted) {
                updatedRows.push({ id: index, _action: 'delete' })
            }
        })

        // Fetch the created rows
        newRows.forEach((newRow: FilterRow, index: number) => {
            const hasRowBeenCreated = currentRows.find(
                (currentRow: FilterRow) => { return newRow === currentRow }) !== undefined;
            if (!hasRowBeenCreated) {
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
        console.log(`New rows : ${newRows}`)
        const tableManager = this.tableManager;
        if (tableManager.current != null) {
            const updatedElements = this.getDiffElements(this.state.rows, JSON.parse(newRows) as FilterRow[]);
            updatedElements.forEach((element: UpdateRow) => {
                tableManager.current?.updateRows(
                    [element]
                )
            })
            this.setState({
                rows: JSON.parse(newRows) as FilterRow[]
            })
        }
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
                <DataGrid
                    columns={filterTableColumns}
                    rows={state.rows}
                    checkboxSelection
                    slots={{
                        toolbar: FilterGridToolbar,
                        footer: DeviceMainInfosGridFooter
                    }}
                    onRowSelectionModelChange={(event) => {
                        updateDeviceMainInfosFilter.performAction(JSON.stringify(event))
                    }}
                    apiRef={this.tableManager}
                />
            </Paper>
        )
    }
}
