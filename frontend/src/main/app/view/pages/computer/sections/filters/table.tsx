import React, { createRef } from "react";

import { type GridColDef, DataGrid } from "@mui/x-data-grid";
import { updateDeviceMainInfosFilter } from "../../../../controller/deviceMainInfos/updateSelectedFilters";
import DeviceMainInfosGridFooter from "./footer/GridFooter";
import { FilterGridToolbar } from "./toolbar/filterGridToolbar";
import { type GridApiCommunity } from "@mui/x-data-grid/internals";
import { type FilterRow } from "../../../../model/filters/FilterManager";

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
 * Updated rows and method to get the diff elements
 */
interface DeviceMainInfosTableProps {
    /**
     * Updated rows
     */
    rows: UpdateRow[]

    /**
     * Get the updated table elements
     * @param {FilterRow[]} currentRows current rows
     * @param {FilterRow[]} newRows  newly created rows
     * @returns {UpdateRow[]} List of every table rows (whether it is created, updated or deleted)
     */
    getDiffElement: (currentRows: FilterRow[], newRows: FilterRow[]) => UpdateRow[]
}

/**
 * Table showing the device main infos table
 * @param {DeviceMainInfosTableProps} props Updated rows and method to get the diff elements
 * @returns {React.JSX.Element} Rendered web component
 */
export default function DeviceMainInfosTable (props: DeviceMainInfosTableProps): React.JSX.Element {
    /**
     * Datagrid row table manager
     */
    const tableManager = createRef() as React.RefObject<GridApiCommunity> | undefined;
    const [rows, setRows] = React.useState<FilterRow[]>([])

    /**
     * Update rows method callback
     * @param {UpdateRow[]} updatedRows Updated filters for the table
     */
    const updateRows = (updatedRows: UpdateRow[]): void => {
        updatedRows.forEach((element: UpdateRow) => {
            (tableManager as React.RefObject<GridApiCommunity>).current.updateRows(
                [element]
            )
        })
        const newRows: FilterRow[] = rows;
        updatedRows.forEach((row: FilterRow | DeleteRow) => {
            if ("elementType" in row) {
                newRows.push(row)
            }
        })
        setRows(newRows)
    }

    updateRows(props.rows)

    return (
        <DataGrid
            columns={filterTableColumns}
            rows={rows}
            checkboxSelection
            slots={{
                toolbar: FilterGridToolbar,
                footer: DeviceMainInfosGridFooter
            }}
            onRowSelectionModelChange={(event) => {
                updateDeviceMainInfosFilter.performAction(JSON.stringify(event))
            }}
            apiRef={tableManager}
        />
    )
}
