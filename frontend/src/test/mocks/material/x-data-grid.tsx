import { forwardRef, ReactNode } from "react";

import { DataGrid, DataGridProps, GridColDef } from "@mui/x-data-grid";
import MockedDataGrid from "../x-data-grid/mockedDataGrid";

/**
 * Build the `MockedDataGrid` DOM element for the jest tests
 * @param {Array<GridColDef>} columns mocked table columns
 * @param {Array<object>} rows Table rows
 * @param {any} props Elements used in the table (here the toolbar and the footer)
 * @returns {ReactNode} Mocked MUI `DataGrid` element
 * @see{@link DataGrid} Based Component
 * @see{@link MockedDataGrid} Mocked Component
 */
const buildMockedDataGrid = (columns: readonly GridColDef[], rows: readonly object[] | undefined,
    props: any): ReactNode => {
    const mockCallbacks: Record<string, any> = {};
    Object.assign(mockCallbacks, props);
    return <MockedDataGrid
        columns={columns}
        rows={rows}
        checkboxSelection={
            props.checkboxSelection !== null ? props.checkboxSelection! : false
        }
        toolbar={props.slots?.toolbar}
        footer={props.slots?.footer}
        slotsProps={props.slotProps}
        updateSelectedRows={mockCallbacks["onRowSelectionModelChange"]}
    />
}

/**
 * Mocks used for the `x-data-grid` library
 */
const mocks = {
    /**
     * Mocked toolbar container (keeps only the children for simplicity)
     * @param {Array<ReactNode>} Toolbar children
     * @returns {ReactNode} Mocked component
     */
    GridToolbarContainer: ({ children }: { children: ReactNode }): ReactNode => {
        return (<div data-testid="toolbar-container">{children}</div>)
    },
    /**
     * Toolbar `columns` button
     */
    GridToolbarColumnsButton: forwardRef((): ReactNode => (
        <div>
            Colonnes
        </div>
    )),
    /**
     * Toolbar `filters` button
     */
    GridToolbarFilterButton: forwardRef((): ReactNode => (
        <div>
            Filtres
        </div>
    )),
    /**
     * Toolbar `density` button
     */
    GridToolbarDensitySelector: forwardRef((): ReactNode => (
        <div>
            Densité
        </div>
    )),
    /**
     * Toolbar `export` button
     */
    GridToolbarExport: forwardRef((): ReactNode => (
        <div>
            Exporter
        </div>
    )),
    /**
     * Data grid mocked component
     */
    DataGrid: forwardRef(({ rows, columns, ...props }: DataGridProps, ref:any) => (
        buildMockedDataGrid(columns, rows, props)
    ))
};

export default mocks;