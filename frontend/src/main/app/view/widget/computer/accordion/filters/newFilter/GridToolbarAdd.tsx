import { Add } from "@mui/icons-material";
import { Tooltip, Button } from "@mui/material";
import NewFilterPaperDialog from "./paperDialog";
import React from "react";

export default function GridToolbarAdd() {
    const [openedDialog, setOpenedDialog] = React.useState(false);
    return (
        <div>
            <Tooltip title={"Add new filter"}>
                <Button startIcon={<Add />} className="newFilterButton" onClick={() => {
                    setOpenedDialog(!openedDialog)
                    console.log(openedDialog)
                }}>
                    New filter
                </Button>
            </Tooltip>
            {openedDialog && <NewFilterPaperDialog />}
        </div>
    )
}