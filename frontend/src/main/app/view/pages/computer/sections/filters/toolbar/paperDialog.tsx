import React, { type Dispatch, type SetStateAction, type JSX } from "react";

import { Paper } from "@mui/material";
import NewFilterForm from "./form";

import "../../../../../../../res/css/ComputerMainInfos.css";

/**
 * Update opened dialog method passed from the toolbar
 */
interface NewFilterPaperDialogProps {
    /**
     * Update opened dialog method
     * @param {boolean} newStatus If the dialog is opened or not
     */
    updateOpenedDialog: Dispatch<SetStateAction<boolean>>
}

/**
 * Paper displaying the new filter dialog
 * @param {NewFilterPaperDialogProps} props Update open dialog method passed from the toolbar
 * @returns { JSX.Element } Rendered dialog
 */
export default function NewFilterPaperDialog (props: NewFilterPaperDialogProps): JSX.Element {
    return <Paper id="NewFilterPaperDialog">
        <NewFilterForm closesDialog={props.updateOpenedDialog} />
    </Paper>
}
