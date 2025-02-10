import React, { type JSX } from "react";

import { Tooltip } from "@mui/material";
import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    type GridToolbarProps
} from "@mui/x-data-grid";
import GridToolbarAdd from "./GridToolbarAdd";

/**
 * Main device infos filter datagrid toolbar DOM component
 */
export const FilterGridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(
    /**
     * Toolbar rendering component
     * @param {GridToolbarProps} props Datagrid props passed
     * @param {React.ForwardedRef<HTMLDivElement>} ref Datagraid references passed
     * @returns {JSX.Element} rendered toolbar
     */
    function GridToolbar (props: GridToolbarProps, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
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
