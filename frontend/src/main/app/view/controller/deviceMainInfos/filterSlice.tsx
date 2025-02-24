import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import AlreadyAddedWarning from "../../../model/exception/warning/alreadyAdded";
import NotFoundError from "../../../model/exception/errors/notFoundError";
import { filterManager } from "../../../model/filters/FilterManager";
import Filter from "../../../model/filters/Filter";

/**
 * Filter slice state
 */
interface FilterSliceState {
    filters: Filter[]
    selectedFilteredIDS: number[]
    error: {
        message: string
        variant: "error" | "default" | "success" | "warning" | "info" | undefined
    }
}

/**
 * Filter slice initial state
 */
const initialState: FilterSliceState = {
    filters: [],
    selectedFilteredIDS: [],
    error: {
        message: "",
        variant: undefined
    }
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        addFilter: (state, action: PayloadAction<Filter>) => {
            const filter = action.payload
            Filter.inputTypeAuthorizedList(action.payload.elementType);
            Filter.comparisonTypesCheck(filter.opType);

            try {
                filterManager.addFilter(
                    filter.elementType as "File" | "Library",
                    filter.fieldName,
                    filter.opType as "<" | ">" | "!=" | "==",
                    filter.value
                )
                state.filters = filterManager.getFilters()
            } catch (e) {
                if (e instanceof AlreadyAddedWarning) {
                    state.error = {
                        variant: "warning",
                        message: e.message
                    }
                }
            }
        },
        deleteFilter: (state, action) => {
            try {
                const inputsIDS = (action.payload) as number[]
                let filterIDS = inputsIDS.map((filterID: unknown) => {
                    return filterID as number;
                });
                filterIDS = filterIDS.sort((firstID, secondID) => {
                    return firstID - secondID
                }).reverse();

                filterIDS.forEach((filterID: number) => {
                    filterManager.removeFilter(filterID)
                });
                state.filters = filterManager.getFilters()
            } catch (error) {
                if (error instanceof NotFoundError) {
                    state.error = {
                        message: error.message,
                        variant: "error"
                    }
                }
            }
        },
        updateSelectedFilter: (state, action) => {
            const selectedIDS = JSON.parse(action.payload) as number[];
            state.selectedFilteredIDS = selectedIDS
        },
        resetError: (state) => {
            state.error = {
                message: "",
                variant: undefined
            }
        }
    }
})

export const { addFilter, deleteFilter, updateSelectedFilter, resetError } = filterSlice.actions

export default filterSlice.reducer
