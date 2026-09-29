import React, { ReactNode } from "react";

import { GridSlotProps, GridSlotsComponentsProps, GridToolbarProps, ToolbarPropsOverrides, type GridColDef } from "@mui/x-data-grid";
import { type UpdateRow } from "../../../main/app/view/pages/computer/sections/filters/table";

/**
 * Mocked data grid footer, toolbar, rows, event change
 */
interface MockedDataGridProps {

    /**
     * Cell data
     */
    rows: readonly any[] | undefined

    /**
     * Cell columns
     */
    columns: ReadonlyArray<GridColDef<any>>

    /**
     * If the data grid has checkbox at the beginning (`undefined` means no checkbox)
     */
    checkboxSelection: boolean;

    /**
     * Toolbar set in the datagrid
     */
    toolbar?: React.JSXElementConstructor<GridToolbarProps & ToolbarPropsOverrides> | null | undefined

    /**
     * 
     */
    footer?: React.JSXElementConstructor<GridSlotProps['footer']> | null

    slotsProps? : GridSlotsComponentsProps
}

/**
 *
 * @param {MockedDataGridProps} props Component data (columns, rows, toolbar & footer, row selection change event)
 * @returns {React.JSX.Element} Rendered mocked data grid
 */
export default function MockedDataGrid (props: MockedDataGridProps): React.JSX.Element {
    /**
     * Checkboxes checked status for each row (if the option is set)
     */
    const [checkboxSelections, updateSelectionList] = React.useState<boolean[]>(
        Array(props.columns.length).fill(false)
    )

    /**
     * Mocker for the function `onRowSelectionModelChange`
     * @param {HTMLTableRowElement} row Row clicked by the user
     * @param {number} index position in the table (`-1` for the header)
     */
    const handleClickEvent = (row: HTMLTableRowElement, index: number): void => {
        const checkbox = row.children[0] as HTMLInputElement;
        checkbox.checked = !checkbox.checked;

        let updatedSelectedIDs: boolean[];
        if (props.rows === undefined && index !== -1) {
            throw new RangeError("No row has been set!")
        }
        if ((props.rows != null) && index > props.columns.length - 1) {
            const rowIndexes = props.rows.map((row) => (row as UpdateRow).id === null ? row.id : undefined)
            throw new RangeError(`The index ${index} has no columns related. The only valid columns are : "${rowIndexes.toString()}"`)
        } else if (index === -1) {
            updatedSelectedIDs = new Array(props.columns.length).fill(checkbox.checked)
        } else {
            updatedSelectedIDs = checkboxSelections;
            updatedSelectedIDs[index] = checkbox.checked;
        }
        updateSelectionList(checkboxSelections)
    }

    const toolbar:ReactNode = React.createElement(
        'div',
        {
            'data-testid':'datagrid-mock-toolbar',
            ...(props.slotsProps?.toolbar ?? {})
        },
        props.toolbar ? React.createElement(props.toolbar):null
    )
    const footer:ReactNode = React.createElement(
        'div',
        {
            'data-testid':'datagrid-mock-footer',
            ...(props.slotsProps?.footer ?? {})
        },
        props.footer ? React.createElement(props.footer, {}):null
    )
    
    //let element = (props.toolbar as React.JSXElementConstructor<GridSlotProps['toolbar']>).render()

    return (
        <div data-testid="mock-datagrid">
            {toolbar}
            <table>
                <thead>
                    <tr className="MuiDataGrid-topContainer" onClick={(e) => {
                        if (props.checkboxSelection) {
                            handleClickEvent(e.currentTarget, -1);
                        }
                    }}>
                        {props.checkboxSelection &&
                            <td><input type="checkbox" /></td>
                        }
                        {props.columns?.map((column) => (
                            <th key={column.field}>{column.headerName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.rows?.map((row, rowIndex) => (
                        <tr key={rowIndex} className="MuiDataGrid-row" onClick={(e) => {
                            handleClickEvent(e.currentTarget, rowIndex);
                        }} >
                            {props.checkboxSelection && <td><input type="checkbox" /></td>}
                            {props.columns?.map((column) => (
                                <td key={`${rowIndex}-${column.field}`}>
                                    {row[column.field]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                footer
            }
        </div >)
}
