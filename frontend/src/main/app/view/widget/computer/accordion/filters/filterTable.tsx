import React from "react";

import { type JSX } from "react";

import { Paper } from "@mui/material";
import { DataGrid, useGridApiRef, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { FilterGridToolbar } from "./filterGridToolbar";
import { filterManager, FilterRow } from "../../../../model/filters/FilterManager";
import { addFilter } from "../../../../controller/deviceMainInfos/addFilter";
import { GridApiCommunity } from "@mui/x-data-grid/models/api/gridApiCommunity";

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
 * State of the filter table
 */
interface FilterTableState {
    rows: FilterRow[]
    tableManager: React.RefObject<GridApiCommunity>
}

/**
 * Table displaying the filters used to displays selected informations
 * in the device main informations page.
 * @param {FilterTableProps} props Fitler and linked delete function associated
 * @returns {JSX.Element} Web component
 */
export default class FilterTable extends React.Component<FilterTableProps, FilterTableState> {

    constructor(props: FilterTableProps) {
        super(props);
        this.state = {
            rows: [],
            tableManager: useGridApiRef()
        }
        addFilter.addObservable("mainDeviceInfosFilterTable", this.updateRows)
    }

    /**
     * Update rows method callback
     * @param newRows 
     */
    updateRows(newRows: unknown[]) {
        console.log(newRows)
        console.log("Updated rows")
        this.setState({
            rows: newRows as FilterRow[]
        })
        console.log(this.state.rows)
        
        const tableManager = this.state.tableManager;
        tableManager.current?.updateRows(
            this.state.rows.map(
                (row: FilterRow, index:number) => ({
                    id: index,
                    elementType: row.elementType,
                    fieldName: row.fieldName,
                    opType: row.comparisonType,
                    filterValue: row.value
                })
            )
        )
    }

    componentWillUnmount(): void {
        addFilter.removeObservable("mainDeviceInfosFilterTable")
    }

    /**
     * Table displaying the filters used to displays selected informations
     * in the device main informations page.
     * @param {FilterTableProps} props Fitler and linked delete function associated
     * @returns {JSX.Element} Web component
     */
    render(): JSX.Element {
        const props = this.props;
        const state = this.state;
        return (
            <Paper className="FilterTable">
                <DataGrid
                    columns={filterTableColumns}
                    rows={state.rows}
                    checkboxSelection
                    onRowSelectionModelChange={(event: GridRowSelectionModel) => {
                        props.removeSelectedIndexes((event.values as any) as [number])
                    }}
                    slots={{
                        toolbar: FilterGridToolbar
                    }}
                />
            </Paper>
        )
    }
}
