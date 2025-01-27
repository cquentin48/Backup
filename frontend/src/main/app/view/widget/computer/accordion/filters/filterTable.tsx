import React from "react";

import { type JSX } from "react";

import { Paper } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { FilterGridToolbar } from "./filterGridToolbar";
import { filterManager } from "../../../../model/filters/FilterManager";

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
 * Table displaying the filters used to displays selected informations
 * in the device main informations page.
 * @param {FilterTableProps} props Fitler and linked delete function associated
 * @returns {JSX.Element} Web component
 */
export default function FilterTable (props: FilterTableProps): JSX.Element {
    console.log(`Readed list : ${JSON.stringify(filterManager.getFilters())}`)
    return (
        <Paper className="FilterTable">
            <DataGrid
                columns={filterTableColumns}
                rows={filterManager.getFilters()}
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
