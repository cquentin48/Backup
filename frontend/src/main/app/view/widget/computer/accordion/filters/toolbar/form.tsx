import React, { type Dispatch, type SetStateAction } from "react";

import {
    FormControl, IconButton, InputLabel,
    MenuItem, Select, TextField, Tooltip
} from "@mui/material";
import Filter from "../../../../../model/filters/Filter";
import { Add } from "@mui/icons-material";
import { addFilter } from "../../../../../controller/deviceMainInfos/addFilter";
import AlreadyAddedWarning from "../../../../../model/exception/warning/alreadyAdded";

import '../../../../../../../res/css/Filters.css';

/**
 * State of the new filter form dialog
 */
interface NewFilterFormState {
    /**
     * Type of input
     * @see {@link Filter}
     */
    inputType: string

    /**
     * Comparison operator
     * @see {@link Filter}
     */
    comparison: string

    /**
     * Value used in the comparison
     * @see {@link Filter}
     */
    value: string

    /**
     * Name of the property used for the comparison
     * @see {@link Filter}
     */
    fieldName: string
}

/**
 * Method which closes the new filter dialog once its done.
 */
interface NewFilterFormProps {
    /**
     * Close new filter dialog method
     */
    closesDialog: Dispatch<SetStateAction<boolean>>
}

/**
 * New filter form in the device main infos page
 */
export default class NewFilterForm extends React.Component<NewFilterFormProps, NewFilterFormState> {
    state: Readonly<NewFilterFormState> = {
        inputType: Filter.authorizedInputTypes[0],
        comparison: Filter.authorizedComparisonOperations[0],
        value: "",
        fieldName: Filter.inputFieldName(
            Filter.authorizedInputTypes[0] as "File" | "Library"
        )[0]
    };

    /**
     * Key pressed handling method
     * @param {KeyboardEvent} pressedKey pressed event
     */
    handlePressedKey (pressedKey: KeyboardEvent): void {
        if (pressedKey.key === "Enter") {
            this.addsNewFilter();
        }
    }

    /**
     * Mount form component lifecycle method
     */
    componentDidMount (): void {
        document.addEventListener("keydown", (event) => { this.handlePressedKey(event); }, false);
    }

    /**
     * Unmount form component lifecycle method
     */
    componentWillUnmount (): void {
        document.removeEventListener("keydown", this.handlePressedKey, false);
    }

    /**
     * Adds a new filter to the main device informations filter list
     */
    addsNewFilter (): void {
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
            this.props.closesDialog(false);
        } catch (error) {
            if (error instanceof AlreadyAddedWarning) {
                console.warn(error.message);
            }
        }
    }

    /**
     * Render the component
     * @returns {React.JSX.Element} Form view component
     */
    render (): React.JSX.Element {
        const state = this.state
        return (
            <div className="newElementDialog">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="inputTypeLabel">Input type</InputLabel>
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
                            Filter.authorizedInputTypes.map((inputType, index) => {
                                return (
                                    <MenuItem value={inputType} key={index}>{inputType}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="fieldNameLabel">Field name</InputLabel>
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
                            Filter.inputFieldName(state.inputType as "File" | "Library").map(
                                (comparison, index) => {
                                    return (
                                        <MenuItem value={comparison} key={index}>{comparison}</MenuItem>
                                    )
                                })
                        }
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="comparisonOperatorLabel">Type of comparison</InputLabel>
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
                            Filter.authorizedComparisonOperations.map((comparison, index) => {
                                return (
                                    <MenuItem value={comparison} key={index}>{comparison}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <TextField
                    id="computerMainInfosFilterValueField"
                    label="Field value"
                    variant="standard"
                    onChange={(newValue:
                    React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        this.setState({
                            value: newValue.target.value
                        })
                    }}
                />
                <Tooltip title="Adds new filter">
                    <IconButton
                        aria-label="add"
                        onClick={() => { this.addsNewFilter(); }}
                    >
                        <Add />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }
}
