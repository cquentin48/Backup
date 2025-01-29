import React from "react";

import { Add } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarProps,
} from "@mui/x-data-grid";
import GridToolbarAdd from "./GridToolbarAdd";

export const FilterGridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(
    function GridToolbar(props, ref) {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Tooltip title={"Add new filter"}>
                    <GridToolbarAdd/>
                </Tooltip>
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    })