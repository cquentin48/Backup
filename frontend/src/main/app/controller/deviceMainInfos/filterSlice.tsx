import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import AlreadyAddedWarning from "../../model/exception/warning/alreadyAdded";
import ConflictError from "../../model/exception/errors/conflictError";
import NotFoundError from "../../model/exception/errors/notFoundError";
import ValidationError from "../../model/exception/errors/validationError";

import Filter from "../../model/filters/Filter";
import { type AppState } from "../store";

/**
 * Filter slice state
 */
export interface FilterSliceState {
    filters: Filter[]
    selectedFilteredIDS: number[]
    filterError: {
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
    filterError: {
        message: "",
        variant: undefined
    }
}

/**
 * Filter manager redux slice
 */
export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        /**
         * Adds a new filter
         * @param {FilterSliceState} state Current filter slice state
         * @param {PayloadAction<Filter>} action New filter yet to be added
         */
        addFilter: (state, action: PayloadAction<Filter>) => {
            try {
                const newFilter = action.payload
                if(state.filters.filter((filter)=>filter.id === newFilter.id).length > 0){
                    throw new AlreadyAddedWarning("Another filter has this id!")
                }
                Filter.inputTypeAuthorizedList(action.payload.elementType);
                Filter.comparisonTypesCheck(newFilter.opType);
                if (state.filters.filter((filter) =>
                    Filter.isEqual(filter, newFilter)
                ).length > 0) {
                    throw new AlreadyAddedWarning("The filter is already set! It will be ignored!")
                }
                state.filters.push(
                    newFilter
                )
            } catch (e) {
                if (e instanceof AlreadyAddedWarning) {
                    state.filterError = {
                        variant: "warning",
                        message: e.message
                    }
                } else if (e instanceof ValidationError) {
                    state.filterError = {
                        variant: "error",
                        message: e.message
                    }
                }
            }
        },

        /**
         * Deletes filters from the filter table
         * @param { FilterSliceState } state current slice state
         * @param { PayloadAction<number[]> } action Filter IDS list for removal
         */
        deleteFilter: (state, action: PayloadAction<number[]>) => {
            try {
                const inputsIDS = action.payload
                let filterIDS = inputsIDS.map((filterID: unknown) => {
                    return filterID as number;
                });
                filterIDS = filterIDS.sort((firstID, secondID) => {
                    return firstID - secondID
                }).reverse();

                filterIDS.forEach((filterID: number) => {
                    const filters = state.filters.filter((filter) => {
                        return filter.id === filterID
                    })
                    if (filters.length === 0) {
                        throw new NotFoundError(`The index ${filterID} set is not in the array !`)
                    } else if (filters.length > 1) {
                        throw new ConflictError(`The index ${filterID} set has found multiple filters in the array!`)
                    }
                    state.filters.splice(filters.indexOf(filters[0]), 1)
                });
                state.filters.forEach((filter, id) => {
                    filter.id = id
                })
            } catch (error) {
                if (error instanceof NotFoundError || error instanceof ConflictError) {
                    state.filterError = {
                        message: (error as NotFoundError).message,
                        variant: "error"
                    }
                }
            }
        },
        updateSelectedFilter: (state, action: PayloadAction<number[]>) => {
            const selectedIDS = action.payload;
            state.selectedFilteredIDS = selectedIDS;
        }
    }
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deviceMainInfosFilterState = (state: AppState) => state.filter;
export default filterSlice.reducer
export const { addFilter, deleteFilter, updateSelectedFilter } = filterSlice.actions
