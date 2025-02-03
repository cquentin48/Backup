import React, { useEffect, type Dispatch, type SetStateAction } from "react";

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
 * @param props Close form dialog function
 */
export default function NewFilterForm (props: NewFilterFormProps) {
    //export default class NewFilterForm extends React.Component<NewFilterFormProps, NewFilterFormState> {
    const [inputType, updateInputType] = React.useState(Filter.authorizedInputTypes[0]);
    const [comparison, updateComparison] = React.useState(Filter.authorizedComparisonOperations[0]);
    const [value, updateValue] = React.useState("");
    const [fieldName, updateFieldName] = React.useState(Filter.inputFieldName(
        Filter.authorizedInputTypes[0] as "File" | "Library"
    )[0]);
    const [focusedInput, updateFocusedInput] = React.useState(3)

    /**
     * Key pressed handling method
     * @param {KeyboardEvent} pressedKey pressed event
     */
    const handlePressedKey = (pressedKey: KeyboardEvent): void => {
        if(pressedKey.key === "Tab"){
            pressedKey.preventDefault();
            updateFocusedInput((focusedInput+1)%4)
            console.log(`${focusedInput}`)
        }
        if (pressedKey.key === "Enter") {
            console.log("Enter key pressed!")
            addsNewFilter();
        }
    }

    /**
     * Adds a new filter to the main device informations filter list
     */
    const addsNewFilter = (): void => {
        const inputs = [
            inputType,
            fieldName,
            comparison,
            value
        ]
        try {
            console.log("New filter added!")
            addFilter.performAction(
                inputs
            )
            props.closesDialog(false);
        } catch (error) {
            if (error instanceof AlreadyAddedWarning) {
                console.warn(error.message);
            }
        }
    }

    useEffect(()=>{
        document.addEventListener("keydown", handlePressedKey)
        return () => document.removeEventListener("keydown", handlePressedKey)
    })

    return (
        <div className="newElementDialog">
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="inputTypeLabel">Input type</InputLabel>
                <Select
                    id="inputType"
                    labelId="inputTypeLabel"
                    value={inputType}
                    label="Data type"
                    onChange={(newInputType) => {
                        updateInputType(
                            newInputType.target.value
                        )
                    }}
                    inputRef={(input) => input && input.focus() && focusedInput == 0}
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
                    value={fieldName}
                    onChange={(newFieldName) => {
                        updateFieldName(newFieldName.target.value)
                    }}
                    inputRef={(input) => input && input.focus() && focusedInput == 1}
                >
                    {
                        Filter.inputFieldName(inputType as "File" | "Library").map(
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
                    value={comparison}
                    onChange={(newComparisonOperator) => {
                        updateComparison(newComparisonOperator.target.value)
                    }}
                    inputRef={(input) => input && input.focus() && focusedInput == 2}
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
                    updateValue(
                        newValue.target.value
                    )
                }}
                inputRef={(input) => input && input.focus() && focusedInput == 3}
            />
            <Tooltip title="Adds new filter">
                <IconButton
                    aria-label="add"
                    onClick={() => {
                        console.log("Button clicked!")
                        addsNewFilter();
                    }}
                >
                    <Add />
                </IconButton>
            </Tooltip>
        </div>
    )
}
