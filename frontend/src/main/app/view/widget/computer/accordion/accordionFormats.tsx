/* eslint @typescript-eslint/ban-types: 0 */
import React from "react";

import { Grid2 } from "@mui/material";

import '../../../../../res/css/ComputerMainInfos.css';
import SoftwareOrigins from "./charts/SoftwareOrigins";
import FilesTypes from "./charts/FilesTypes";
import Filters from "./filters/filters";

/**
 * Page current state
 */
interface AccordionFormatsState {
    /**
     * Filters set by the user
     */
    filters: [string?]
}

/**
 * Accordion displaying the formats (software and libraries) inside pie charts
 */
export default class AccordionFormats extends React.Component<{}, AccordionFormatsState> {
    /**
     * Component state
     */
    state: AccordionFormatsState = {
        filters: []
    }

    /**
     * Adds a new filter to display selected data.
     * @param {string} newFilter new filter to add
     */
    addNewFilter(newFilter: string): void {
        if (this.state.filters.includes(newFilter)) {
            console.log("This filter has already been set!")
        } else {
            const filters = this.state.filters;
            filters.push(newFilter);
            this.setState({
                filters
            })
        }
    }

    /**
     * Remove filters selected by the user
     * @param {[number?]} indexes filters indexes set in the array
     */
    removeFilters(indexes: [number?]): void {
        const filters = this.state.filters;
        const reverseSortedIndexes = indexes.sort(
            (a: number | undefined, b: number | undefined) => {
                if (a === undefined || b === undefined) {
                    throw new Error("No filter has been chosen for the suppression!!")
                }
                return a - b
            }
        ).reverse()
        if (reverseSortedIndexes.length > 0) {
            reverseSortedIndexes.forEach((index: number | undefined) => {
                if (index === undefined) {
                    throw new Error("The index is not set!");
                } else if (index < 0) {
                    throw new Error("Impossible to remove this element : it is below 0!");
                } else if (index > filters.length - 1) {
                    throw new Error("Impossible to remove this element : no element has its index")
                } else {
                    filters.splice(index, 1);
                }
            })
        }
    }

    /**
     * Render the component
     * @returns {React.JSX.Element} Accordion displaying the file formats and libraries types
     */
    render(): React.JSX.Element {
        const state = this.state

        return (
            <div>
                <Filters
                    filters={state.filters}
                    removeFilters={this.removeFilters}
                    addNewFilter={this.addNewFilter}
                />
                <Grid2 container spacing={2} id="pieCharts">
                    <Grid2 size={6}>
                        <SoftwareOrigins />
                    </Grid2>
                    <Grid2 size={6}>
                        <FilesTypes />
                    </Grid2>
                </Grid2>
            </div>
        )
    }
}
