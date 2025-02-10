import React from "react";

import FilterTable from "./table";

/**
 * Interface declaring the elements passed from the device main informations page
 */
interface FilterTableProps {
    /**
     * Remove filter function
     * @param elementIndexes index of every filter removed
     */
    removeFilters: (elementIndexes: [number?]) => void

    /**
     * Filters set by the user
     */
    filters: string[]
}

/**
 * Filters components for the main informations view of the device page
 * @param {FilterTableProps} props Elements passed from the device main informations page
 * @returns {React.JSX.Element} Filter view component
 */
export default function FiltersSection (props: FilterTableProps): React.JSX.Element {
    return (
        <div id="computerMainInfosFilterTable">
            <FilterTable
                filters={props.filters}
                removeSelectedIndexes={props.removeFilters}
            />
        </div>
    )
}
