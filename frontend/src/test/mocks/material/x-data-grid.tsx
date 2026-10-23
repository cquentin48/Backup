import { DataGridProps } from "@mui/x-data-grid";
import MockedDataGrid from "../x-data-grid/mockedDataGrid";

jest.mock("@mui/x-data-grid", () => {
    return {
        ...jest.requireActual("@mui/x-data-grid"),
        GridToolbarContainer: ({ children }: { children: React.ReactNode }) => {
            return (<div data-testid="toolbar-container">{children}</div>)
        },
        GridToolbarColumnsButton: () => (
            <div>
                Colonnes
            </div>
        ),
        GridToolbarFilterButton: () => (
            <div>
                Filtres
            </div>
        ),
        GridToolbarDensitySelector: () => (
            <div>
                Densité
            </div>
        ),
        GridToolbarExport: () => (
            <div>
                Exporter
            </div>
        ),
        DataGrid: ({ rows, columns, ...props }: DataGridProps & { apiRef: React.RefObject<any> }) => {
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
    }
});