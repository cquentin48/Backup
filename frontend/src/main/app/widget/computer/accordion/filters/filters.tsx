import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "@mui/material";
import React from "react";
import FilterTable from "./filterTable";

/**
 * Interface declaring the elements passed from the device main informations page
 */
interface FilterTableProps {
    /**
     * Function to add a new filter
     * @param newFilter newly created filter
     */
    addNewFilter: (newFilter: string) => void;

    /**
     * Remove filter function
     * @param elementIndexes index of every filter removed
     */
    removeFilters: (elementIndexes: [number?]) => void;

    /**
     * Filters set by the user
     */
    filters: [string?];
}

/**
 * Filters components for the main informations view of the device page
 * @param props Elements passed from the device main informations page
 * @returns Filter view component
 */
export default function Filters(props: FilterTableProps): React.JSX.Element {
    const declaredFilters = ['a'];
    const table = declaredFilters.length > 0 ?
        <FilterTable
            filters={props.filters}
            removeSelectedIndexes={props.removeFilters}
        /> :
        <div>No filter has been added yet</div>;
    return (
        <div id="computerMainInfosFilterTable">
            {table}
            <Button
                className="rightEndControlButton"
                startIcon={<Icon path={mdiPlus} />}
            >
                Add new filter
            </Button>
        </div>
    )
}