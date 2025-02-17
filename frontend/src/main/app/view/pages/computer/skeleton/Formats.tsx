import { Grid2 } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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

export default function FormatsSkeleton () {
    return (

        <div className="DeviceMainInfos">
            <DataGrid
                columns={filterTableColumns}
                loading
            />
            <Grid2 container spacing={2} id="pieCharts">
                <Grid2 size={6}>
                </Grid2>
            </Grid2>
        </div>
    )
}