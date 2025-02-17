import React, { JSX } from "react";

import { Add } from "@mui/icons-material";
import { Tooltip, Button } from "@mui/material";
import NewFilterPaperDialog from "./paperDialog";

/**
 * Toolbar icon button add
 * @returns {JSX.Element} Rendered component
 */
export default function GridToolbarAdd (): React.JSX.Element {
    const [openedDialog, setOpenedDialog] = React.useState(false);
    return (
        <div id="NewDeviceFilterButton">
            <Tooltip title={"Add new filter"}>
                <Button startIcon={<Add />} className="newFilterButton" onClick={() => {
                    setOpenedDialog(!openedDialog)
                }}>
                    New filter
                </Button>
            </Tooltip>
            {openedDialog && <NewFilterPaperDialog updateOpenedDialog={setOpenedDialog}/>}
        </div>
    )
}
