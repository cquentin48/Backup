import React, { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { useSnackbar } from "notistack";

import "../../../../../../../res/css/Filters.css";

import Filter from "../../../../../../model/filters/Filter";
import ValidationError from "../../../../../../model/exception/errors/validationError";
import AlreadyAddedWarning from "../../../../../../model/exception/warning/alreadyAdded";
import DeviceMainInfosFilterCreationButton from "./createFilterButton";
import FieldValue from "./fieldValue";
import FilterToolbar from "./selectFilter";
import { useDispatch } from "react-redux";
import { addFilter } from "../../../../../controller/deviceMainInfos/filterSlice";
import { filterManager } from "../../../../../../model/filters/FilterManager";

/**
 * State of the new filter form dialog
 */
// interface NewFilterFormState {
/**
 * Type of input
 * @see {@link Filter}
 */
// inputType: string

/**
 * Comparison operator
 * @see {@link Filter}
 */
// comparison: string

/**
 * Value used in the comparison
 * @see {@link Filter}
 */
// value: string

/**
 * Name of the property used for the comparison
 * @see {@link Filter}
 */
// fieldName: string
// }

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
 * Data defining an error for the snackbar notification
 */
interface DataError {
    /**
     * Error message
     */
    message: string

    /**
     * Error type
     */
    variant: string
}

/**
 * New filter form in the device main infos page
 * @param {NewFilterFormProps} props Close form dialog function
 * @returns {React.JSX.Element} rendered component
 */
export default function NewFilterForm (props: NewFilterFormProps): React.JSX.Element {
    const [inputType, updateInputType] = React.useState(Filter.authorizedInputTypes[0]);
    const [comparison, updateComparison] = React.useState(Filter.authorizedComparisonOperations[0]);
    const [value, updateValue] = React.useState("");
    const [fieldName, updateFieldName] = React.useState(Filter.inputFieldName(
        Filter.authorizedInputTypes[0] as "File" | "Library"
    )[0]);
    const [focusedInput, updateFocusedInput] = React.useState(3)
    const inputRefs = useRef<Array<() => undefined>>([]);
    const [firstTime, updateFirstTime] = React.useState(true);

    const dispatch = useDispatch()

    const { enqueueSnackbar } = useSnackbar()

    /**
     * Adds a new filter to the main device informations filter list
     */
    const addsNewFilter = (): void => {
        const filter = new Filter(
            inputType as "File" | "Library",
            fieldName,
            comparison as '<' | '>' | '!=' | '==' | "includes",
            value as unknown as object,
            filterManager.getFilters().length
        )
        if (value.length > 0) {
            dispatch(
                addFilter(
                    filter
                )
            )
        } else {
            throw new ValidationError("You must enter a value for the filter to create it!")
        }
        props.closesDialog(false);
    }

    useEffect(() => {
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
                try {
                    addsNewFilter();
                } catch (rawError) {
                    const error = initError(rawError as Error)
                    enqueueSnackbar((error as any).message, { variant: (error as any).variant })
                }
            }
        }

        document.addEventListener("keydown", handlePressedKey)

        return () => { document.removeEventListener("keydown", handlePressedKey); }
    })

    const initInputRef = (input: never, i: number): void => {
        inputRefs.current[i] = input;
    }

    /**
     * Initialise an error
     * @param {Error} error Error thrown in an operation
     * @returns {DataError} error Data
     * TODO: move towards an utils file
     */
    const initError = (error: Error): DataError => {
        let variant: "warning" | "error" | "default" | "success" | "info" | undefined = "default";
        let message = "";
        if (error instanceof AlreadyAddedWarning) {
            variant = "warning"
            message = error.message;
        } else if (error instanceof ValidationError) {
            variant = "error"
            message = error.message;
        }
        return { variant, message }
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
            <DeviceMainInfosFilterCreationButton
                addNewFilter={() => {
                    addsNewFilter()
                }}
            />
        </div>
    )
}
