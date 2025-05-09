import React, { createRef } from "react";

import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type GridApiCommunity } from "@mui/x-data-grid/internals";

import { useSnackbar } from "notistack";

import { useDispatch, useSelector } from "react-redux";

import DeviceMainInfosGridFooter from "./footer/GridFooter";
import { FilterGridToolbar } from "./toolbar/filterGridToolbar";

import { deviceMainInfosFilterState, updateSelectedFilter } from "../../../../../controller/deviceMainInfos/filterSlice";

import { snapshotState } from "../../../../../controller/deviceMainInfos/loadSnapshotSlice";
import type Filter from "../../../../../model/filters/Filter";

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
type UpdateRow = DeleteRow | Filter;

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
        field: 'value',
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
    const { filters, filterError } = useSelector(deviceMainInfosFilterState)

    const { operationStatus } = useSelector(snapshotState)

    const [currentRows, setViewRows] = React.useState<Filter[]>([])

    const { enqueueSnackbar } = useSnackbar()

    const dispatch = useDispatch()

    /**
     * Filter table manager
     */
    const tableManager = createRef<GridApiCommunity>() as React.RefObject<GridApiCommunity> | undefined

    /**
     * Between the update filter list and the current filter list, compute
     * the differences done.
     * @param { Filter[] } currentRows Current filter list set in the datagrid
     * @param { Filter[] } newRows New filter list computed in the recently done operation
     * @returns { UpdateRow[] } Row updated list ready for the transaction
     */
    const updateRows = (currentRows: Filter[], newRows: Filter[]): UpdateRow[] => {
        const updatedRows: UpdateRow[] = [];

        // Fetch the deleted rows
        currentRows.forEach((currentRow: Filter, index: number) => {
            const hasRowBeenDeleted = newRows.find(
                (newRow: Filter) => { return newRow === currentRow })
            if ((hasRowBeenDeleted == null) === undefined) {
                updatedRows.push({ id: index, _action: 'delete' })
            }
        })

        // Fetch the created rows
        newRows.forEach((newRow: Filter, index: number) => {
            const hasRowBeenCreated = currentRows.find(
                (currentRow: Filter) => { return newRow === currentRow });
            if (hasRowBeenCreated === undefined) {
                updatedRows.push({
                    id: index,
                    opType: newRow.opType,
                    fieldName: newRow.fieldName,
                    elementType: newRow.elementType,
                    value: newRow.value
                })
            }
        })

        if ((tableManager as React.RefObject<GridApiCommunity>).current != null) {
            filters.forEach((row: UpdateRow) => {
                (tableManager as React.RefObject<GridApiCommunity>).current.updateRows(
                    [row]
                )
            })

            setViewRows(filters)
        }
        return updatedRows;
    }

    if (filterError.message !== "" && filterError.variant !== undefined) {
        enqueueSnackbar(
            filterError.message,
            {
                variant: filterError.variant
            }
        )
    }

    if (operationStatus === "success") {
        updateRows(currentRows, filters)
        return (
            <Paper className="FilterTable">
                <DataGrid
                    columns={filterTableColumns}
                    rows={filters}
                    checkboxSelection
                    slots={{
                        toolbar: FilterGridToolbar,
                        footer: DeviceMainInfosGridFooter
                    }}
                    onRowSelectionModelChange={(event) => {
                        const values = Array.from(new Set(event.values())) as number[]
                        dispatch(updateSelectedFilter(values))
                    }}
                    apiRef={tableManager}
                />
            </Paper>
        )
    }
    if (operationStatus === "error") {
        return (
            <Paper className="FilterTable">
                <Typography variant="h1">
                    Error in rendering the table : the snapshot can&apos;t be loaded!
                </Typography>
            </Paper>
        )
    }

    return (
        <Box className="FilterTable" >
            <Skeleton width="100%" height={203}>
                <DataGrid
                    columns={[]}
                    slotProps={{
                        toolbar: {
                            hidden: true
                        },
                        columnHeaders: {
                            hidden: true
                        }
                    }}
                    apiRef={tableManager}
                />
            </Skeleton>
        </Box>
    )
}
