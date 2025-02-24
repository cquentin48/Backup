import React from "react";

import { Box } from "@mui/material";
import GridFooterDelete from "./GridFooterDel";

import "../../../../../../../res/css/Filters.css";
import { useSelector } from "react-redux";
import { type AppState } from "../../../../../controller/store";

/**
 * Device main infos datagrid footer
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceMainInfosGridFooter (): React.JSX.Element {
    const ids = useSelector((app: AppState) => app.filters.selectedFilteredIDS)

    /**
     * Render web component
     * @returns {React.JSX.Element} Rendered component
     */
    let formatedFiltersCount = `${ids.length} filtre`
    if (ids.length > 1) {
        formatedFiltersCount = `${formatedFiltersCount}s sélectionnés`
    } else {
        formatedFiltersCount = `${formatedFiltersCount} sélectionné`
    }
    if (ids.length > 0) {
        return (
            <Box
                id="GridFooterContent"
            >
                <p>{formatedFiltersCount}!</p>
                <GridFooterDelete selectedIds={ids} />
            </Box>
        )
    } else {
        return <div id="GridFooterNoContent"></div>
    }
}
