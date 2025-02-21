import { createSlice } from "@reduxjs/toolkit";
import { filterManager, FilterRow } from "../../model/filters/FilterManager";
import Filter from "../../model/filters/Filter";
import AlreadyAddedWarning from "../../../model/exception/warning/alreadyAdded";
import { SnapshotSoftware } from "../../../model/snapshot/snapshotLibrary";
import NotFoundError from "../../../model/exception/errors/notFoundError";

/**
 * Deleted filter row interface
 */
interface DeleteRow {
    /**
     * Row id of the filter in the datagrid
     */
    id: number

    /**
     * Row update action (``delete`` here)
     */
    _action?: 'delete'
}

/**
 * Update row type used for the row update transaction
 */
type UpdateRow = DeleteRow | FilterRow;

interface FilterSliceState {
    filters: FilterRow[];
    selectedFilteredIDS: number[];
    error: {
        message: string;
        variant: "error" | "default" | "success" | "warning" | "info" | undefined;
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
        addFilter: (state, action) => {
            const inputs = JSON.parse(action.payload as string)
            const elementType = inputs[0];
            const fieldName = inputs[1];
            const comparisonType = inputs[2] as "<" | ">" | "!=" | "==";
            const value = inputs[3] as unknown as object;

            Filter.inputTypeAuthorizedList(elementType);
            Filter.comparisonTypesCheck(comparisonType);

            try {
                filterManager.addFilter(
                    elementType as "File" | "Library",
                    fieldName,
                    comparisonType,
                    value
                )
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
                const inputsIDS = JSON.parse(action.payload) as string[]
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
            }
            catch (error) {
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