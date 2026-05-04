import React, { ReactNode, useEffect } from "react";

import { GridCallbackDetails, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { deviceMainInfosFilterState, updateSelectedFilter } from "../../../main/app/controller/deviceMainInfos/filterSlice";

/**
 * Mocked data grid footer, toolbar, rows, event change
 */
interface MockedDataGridProps {

    /**
     * Toolbar
     */
    toolbar: ReactNode | undefined;

    /**
     * Cell data
     */
    rows: readonly any[] | undefined;

    /**
     * Cell columns
     */
    columns: readonly GridColDef<any>[];

    /**
     * If the data grid has checkbox at the beginning (`undefined` means no checkbox)
     */
    checkboxSelection?: boolean | undefined;

    /**
     * Event listener for checkbox selection change
     */
    onRowSelectionModelChange?: ((rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => void);
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
    const [checkboxSelections, updateSelectionList] = React.useState<Array<boolean>>(
        Array(props.columns.length).fill(false)
    )

    const { selectedFilteredIDS } = useSelector(deviceMainInfosFilterState)

    /**
     * Mocker for the function `onRowSelectionModelChange`
     * @param {HTMLTableRowElement} row Row clicked by the user
     * @param {number} index position in the table (`-1` for the header)
     */
    const handleClickEvent = (row: HTMLTableRowElement, index: number) => {
        let checkbox = row.children[0] as HTMLInputElement;
        checkbox.checked = !checkbox.checked;

        let updatedSelectedIDs: Array<boolean>;
        if (props.rows === undefined && index !== -1) {
            throw new RangeError("No row has been set!")
        }
        if (props.rows && index > props.columns.length - 1) {
            let rowIndexes = props.rows.map((row) => row.id ? row.id : undefined)
            throw new RangeError(`The index ${index} has no columns related. The only valid columns are : "${rowIndexes.toString()}"`)
        }
        else if (index == -1) {
            updatedSelectedIDs = new Array(props.columns.length).fill(checkbox.checked)
        } else {
            updatedSelectedIDs = checkboxSelections;
            updatedSelectedIDs[index] = checkbox.checked;
        }
    }
    /**
     * Selected rows
     */
    const selectedIDs = checkboxSelections.filter(isSelected => isSelected === true)
    let footerText = `${selectedIDs} filtre`;

    useEffect(() => {
        if (selectedIDs.length > 1) {
            footerText += "s sélectionnés"
        } else {
            footerText = "sélectionné"
        }
    },[selectedFilteredIDS])

    return (
        <div data-testid="mock-datagrid">
            <table>
                <thead>
                    <tr className="MuiDataGrid-topContainer" onClick={(e) => {
                        if (props.checkboxSelection) {
                            handleClickEvent(e.currentTarget, -1);
                        }
                    }}>
                        {props.checkboxSelection && <input type="checkbox" />}
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
                            {props.checkboxSelection && <input type="checkbox" />}
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
                selectedFilteredIDS.length > 0 && <div>
                    <p>{footerText}!</p>
                    <button><Delete />Delete filters</button>
                </div>
            }
        </div >)
}