import React from "react"
import MockedDataGridNewFilterDialog from "./mockedDataGridNewFilterDialog";

/**
 * Mocked toolbar for the filter datagrid set in the computer view
 * @returns {React.JSX.Element} rendered mocked component
 */
export default function MockedDataGridToolbar (): React.JSX.Element {
    const [isNewFilterDialogOpened, openNewFilterDialog] = React.useState(false);
    return (
        <div data-testid="mock-datagridheader">
            <button type="button" name="New filter" onClick={
                () => {
                    const previousState = isNewFilterDialogOpened;
                    openNewFilterDialog(!previousState);
                }
            }>New filter</button>
            {isNewFilterDialogOpened && <MockedDataGridNewFilterDialog/>}
        </div>
    )
}