import React, { createRef, useEffect } from "react";

import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type GridApiCommunity } from "@mui/x-data-grid/internals";

import { useSnackbar } from "notistack";

import { useDispatch, useSelector } from "react-redux";

import { type FilterRow } from "../../../../../model/filters/FilterManager";

import DeviceMainInfosGridFooter from "./footer/GridFooter";
import { FilterGridToolbar } from "./toolbar/filterGridToolbar";

import { updateSelectedFilter, resetError } from "../../../../controller/deviceMainInfos/filterSlice";

import { type AppState } from "../../../../controller/store";

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
 * Table displaying the filters used to displays selected informations
 * in the device main informations page.
 * @returns {React.JSX.Element} Rendered component
 */
export default function FilterTable (): React.JSX.Element {
    const rows = useSelector((state: AppState) => state.filters.filters)
    const error = useSelector((state: AppState) => state.filters.error)

    const [currentRows, setViewRows] = React.useState<FilterRow[]>([])

    const { enqueueSnackbar } = useSnackbar()

    const dispatch = useDispatch()

    /**
     * Filter table manager
     */
    const tableManager = createRef<GridApiCommunity>() as React.RefObject<GridApiCommunity> | undefined

    /**
     * Between the update filter list and the current filter list, compute
     * the differences done.
     * @param { FilterRow[] } currentRows Current filter list set in the datagrid
     * @param { FilterRow[] } newRows New filter list computed in the recently done operation
     * @returns { UpdateRow[] } Row updated list ready for the transaction
     */
    const updateRows = (currentRows: FilterRow[], newRows: FilterRow[]): UpdateRow[] => {
        const updatedRows: UpdateRow[] = [];

        console.log(newRows)

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

        if ((tableManager as React.RefObject<GridApiCommunity>).current != null) {
            rows.forEach((row: UpdateRow) => {
                (tableManager as React.RefObject<GridApiCommunity>).current.updateRows(
                    [row]
                )
            })

            setViewRows(rows)
        }
        return updatedRows;
    }

    useEffect(()=>{
        updateRows(currentRows, rows)
    }, [rows])

    if (error.message !== "" && error.variant !== undefined) {
        enqueueSnackbar(
            error.message,
            {
                variant: error.variant
            }
        )
        resetError()
    }

    return (
        <Paper className="FilterTable">
            <DataGrid
                columns={filterTableColumns}
                rows={rows}
                checkboxSelection
                slots={{
                    toolbar: FilterGridToolbar,
                    footer: DeviceMainInfosGridFooter
                }}
                onRowSelectionModelChange={(event) => {
                    dispatch(updateSelectedFilter(JSON.stringify(event)))
                }}
                apiRef={tableManager}
            />
        </Paper>
    )
}
