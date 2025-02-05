import React, { useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import { FormControl, IconButton, TextField, Tooltip } from "@mui/material";
import Filter from "../../../../../model/filters/Filter";
import { Add } from "@mui/icons-material";
import { addFilter } from "../../../../../controller/deviceMainInfos/addFilter";
import AlreadyAddedWarning from "../../../../../../model/exception/warning/alreadyAdded";

import '../../../../../../../res/css/Filters.css';
import FilterToolbar from "./selectFilter";
import FieldValue from "./fieldValue";

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
    const [inputType, updateInputType] = React.useState(Filter.authorizedInputTypes[0]);
    const [comparison, updateComparison] = React.useState(Filter.authorizedComparisonOperations[0]);
    const [value, updateValue] = React.useState("");
    const [fieldName, updateFieldName] = React.useState(Filter.inputFieldName(
        Filter.authorizedInputTypes[0] as "File" | "Library"
    )[0]);
    const [focusedInput, updateFocusedInput] = React.useState(3)
    const inputRefs = useRef<(() => void | undefined)[]>([]);
    const [firstTime, updateFirstTime] = React.useState(true);

    /**
     * Key pressed handling method
     * @param {KeyboardEvent} pressedKey pressed event
     */
    const handlePressedKey = (pressedKey: KeyboardEvent): void => {
        if (pressedKey.key === "Tab") {
            pressedKey.preventDefault();
            updateFocusedInput((focusedInput + 1) % 4);
            (inputRefs.current[focusedInput] as any).focus();
        }
        if (pressedKey.key === "Enter") {
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
            addFilter.performAction(
                JSON.stringify(inputs)
            )
            props.closesDialog(false);
        } catch (error) {
            if (error instanceof AlreadyAddedWarning) {
                console.warn(error.message);
            }
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handlePressedKey)
        return () => document.removeEventListener("keydown", handlePressedKey)
    })

    const initInputRef = (input: never, i: number): void => {
        inputRefs.current[i] = input;
    }

    return (
        <div className="newElementDialog">
            <FilterToolbar
                selectedValue={inputType}
                initInputRef={initInputRef}
                inputID={0}
                selectedItem={Filter.authorizedInputTypes}
                updateSelectedValue={updateInputType}
                selectID="inputType"
                selectLabel="Data type"
            />
            <FilterToolbar
                selectedValue={fieldName}
                initInputRef={initInputRef}
                inputID={1}
                selectedItem={Filter.inputFieldName(inputType as "File" | "Library")}
                updateSelectedValue={updateFieldName}
                selectID="fieldName"
                selectLabel="Field name"
            />
            <FilterToolbar
                selectedValue={comparison}
                initInputRef={initInputRef}
                inputID={2}
                selectedItem={Filter.authorizedComparisonOperations}
                updateSelectedValue={updateComparison}
                selectID="comparisonOperator"
                selectLabel="Type of comparison"
            />
            <FieldValue
                fieldName={value}
                firstTime={firstTime}
                getfieldNameType={Filter.getFieldNameType(inputType, fieldName)}
                index={3}
                initInputRef={initInputRef}
                updateFirstTime={updateFirstTime}
                updateValue={updateValue}
                value={value}
            />
            <Tooltip title="Adds new filter">
                <IconButton
                    aria-label="add"
                    onClick={() => {
                        if(value.length > 0){
                            addsNewFilter();
                        }else{
                            console.log("You must enter a value!")
                        }
                    }}
                >
                    <Add />
                </IconButton>
            </Tooltip>
        </div>
    )
}
