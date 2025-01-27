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
import NewFilterPaperDialog from "./newFilter/paperDialog";

export const FilterGridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(
    function GridToolbar(props, ref) {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Tooltip title={"Add new filter"}>
                    <div>
                        <Button startIcon={<Add />}>
                            New filter

                        </Button>
                        <NewFilterPaperDialog />
                    </div>
                </Tooltip>
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    })