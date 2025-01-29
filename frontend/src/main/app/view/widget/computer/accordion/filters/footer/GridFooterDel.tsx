import React from "react";

import { Delete } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { GridRowModel, useGridApiContext } from "@mui/x-data-grid";

export default function GridFooterDelete() {
    const dataAPI = useGridApiContext();
    const selectedRows = dataAPI.current?.getSelectedRows();
    const ids:number[] = []
    selectedRows!.forEach((row: GridRowModel) =>{
        const id = row.id;
        ids.push(id);
    })
    console.log(JSON.stringify(ids))
    return (
        <Tooltip title="Delete filters">
            <Button startIcon={<Delete/>} disabled={ids.length === 0}>
                Delete filters
            </Button>
        </Tooltip>
    )
}