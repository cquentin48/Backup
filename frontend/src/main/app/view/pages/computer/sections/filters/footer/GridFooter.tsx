import React from "react";

import { Box } from "@mui/material";
import GridFooterDelete from "./GridFooterDel";

import "../../../../../../../res/css/Filters.css";
import { useSelector } from "react-redux";
import { deviceMainInfosFilterState } from "../../../../../../controller/deviceMainInfos/filterSlice";

/**
 * Device main infos datagrid footer
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceMainInfosGridFooter (): React.JSX.Element {
    const { selectedFilteredIDS } = useSelector(deviceMainInfosFilterState)

    /**
     * Render web component
     * @returns {React.JSX.Element} Rendered component
     */
    let formatedFiltersCount = `${selectedFilteredIDS.length} filtre`
    if (selectedFilteredIDS.length > 1) {
        formatedFiltersCount = `${formatedFiltersCount}s sélectionnés`
    } else {
        formatedFiltersCount = `${formatedFiltersCount} sélectionné`
    }
    if (selectedFilteredIDS.length > 0) {
        return (
            <Box
                id="GridFooterContent"
            >
                <p>{formatedFiltersCount}!</p>
                <GridFooterDelete selectedIds={selectedFilteredIDS} />
            </Box>
        )
    } else {
        return <div id="GridFooterNoContent"></div>
    }
}
