import React from "react";

import { Button, MenuItem, Select, TextField } from "@mui/material";
import Filter from "../../../../../model/filters/Filter";
import { Add } from "@mui/icons-material";
import { addFilter } from "../../../../../controller/deviceMainInfos/addFilter";
import AlreadyAddedWarning from "../../../../../model/exception/warning/alreadyAdded";
import { filterManager } from "../../../../../model/filters/FilterManager";

interface NewFilterFormState {
    inputType: string;
    comparison: string;
    value: string;
    fieldName: string;
}

/**
 * New filter form in the device main infos page
 */
export default class NewFilterForm extends React.Component<{}, NewFilterFormState> {
    state: Readonly<NewFilterFormState> = {
        inputType: Filter.authorizedInputTypes[0],
        comparison: Filter.authorizedComparisonOperations[0],
        value: "",
        fieldName: Filter.inputFieldName(
            Filter.authorizedInputTypes[0] as "File" | "Library"
        )[0]
    };

    /**
     * Render the component
     * @returns {React.JSX.Element} Form view component
     */
    render(): React.JSX.Element {
        const state = this.state
        return (
            <div>
                <Select
                    id="inputType"
                    labelId="inputTypeLabel"
                    value={state.inputType}
                    label="Data type"
                    onChange={(newInputType) => {
                        this.setState({
                            inputType: newInputType.target.value
                        })
                    }}
                >
                    {
                        Filter.authorizedInputTypes.map((inputType) => {
                            return (
                                <MenuItem value={inputType}>{inputType}</MenuItem>
                            )
                        })
                    }
                </Select>
                <Select
                    id="fieldName"
                    labelId="fieldNameLabel"
                    label="Field name"
                    value={state.fieldName}
                    onChange={(newFieldName) => {
                        this.setState({
                            fieldName: newFieldName.target.value
                        })
                    }}
                >
                    {
                        Filter.inputFieldName(state.inputType as "File" | "Library").map((comparison) => {
                            return (
                                <MenuItem value={comparison}>{comparison}</MenuItem>
                            )
                        })
                    }
                </Select>
                <Select
                    id="comparisonOperator"
                    labelId="comparisonOperatorLabel"
                    label="Type of comparison"
                    value={state.comparison}
                    onChange={(newComparisonOperator) => {
                        this.setState({
                            comparison: newComparisonOperator.target.value
                        })
                    }}
                >
                    {
                        Filter.authorizedComparisonOperations.map((comparison) => {
                            return (
                                <MenuItem value={comparison}>{comparison}</MenuItem>
                            )
                        })
                    }
                </Select>
                <TextField
                    id="value"
                    label="value"
                    autoFocus
                    onChange={(newValue) => {
                        this.setState({
                            value: newValue.target.value
                        })
                    }}
                />
                <Button startIcon={<Add />} onClick={() => {
                    const state = this.state
                    const inputs = [
                        state.inputType,
                        state.fieldName,
                        state.comparison,
                        state.value
                    ]
                    try {
                        addFilter.performAction(
                            inputs
                        )
                        filterManager.getFilters()
                    }catch(error){
                        if(error instanceof AlreadyAddedWarning){
                            console.warn(error.message);
                        }
                    }
                }}>
                    Adds new filter
                </Button>
            </div>
        )
    }
}