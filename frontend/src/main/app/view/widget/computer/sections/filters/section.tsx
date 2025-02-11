import React from "react";

import FilterTable from "./table";

/**
 * Filters components for the main informations view of the device page
 * @returns {React.JSX.Element} Filter view component
 */
export default function FiltersSection (): React.JSX.Element {
    return (
        <div id="computerMainInfosFilterTable">
            <FilterTable/>
        </div>
    )
}
