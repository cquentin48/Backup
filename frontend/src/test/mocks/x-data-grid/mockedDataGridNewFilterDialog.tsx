import React, { useEffect } from "react";
import Filter from "../../../main/app/model/filters/Filter";
import MockedDataGridFieldValue from "./fieldValue";
import MockedDataGridSelector from "./selector";
import ValidationError from "../../../main/app/model/exception/errors/validationError";
import MockedNewFilterButton from "./newFilterButton";
import { useSnackbar } from "notistack";

/**
 * Mocked New filter dialog
 * @param {MockedDataGridNewFilterDialogProps} props Dialog opened state
 * @return {React.JSX.Element} mocked dialog component
 */
export default function MockedDataGridNewFilterDialog (): React.JSX.Element {
    const [inputType, updateinputType] = React.useState<string>(Filter.authorizedInputTypes[0])
    const [fieldName, updateFieldName] = React.useState(Filter.inputFieldName(
        Filter.authorizedInputTypes[0] as "File" | "Library"
    )[0])
    const [comparison, updateComparison] = React.useState(Filter.authorizedComparisonOperationsString[0]);
    const [fieldValue, updateFieldValue] = React.useState("");
    const [focusedInputID, updateFocusID] = React.useState(3);
    const [hasBeenModified, setFirstModificationStatus] = React.useState(false)


    const { enqueueSnackbar } = useSnackbar();
    
    /**
     * Mock update of the field value
     * @param {string} currentValue New value for the field
     */
    const updateValue = (currentValue: string) => {
        if(hasBeenModified && currentValue === ""){
            enqueueSnackbar("You must enter a value here!", {variant: "error"})
        }
        else{
            setFirstModificationStatus(true);
        }
        updateFieldValue(currentValue);
    }

    /**
     * Check if the new filter is valid for addition
     */
    const validateInput = (): void => {
        if (fieldValue === "") {
            throw new ValidationError("You must enter a value for the filter to create it!");
        }
    }

    useEffect(() => {
        /**
         * Key pressed handling method
         * @param {KeyboardEvent} pressedKey pressed event
         */
        const handlePressedKey = (pressedKey: KeyboardEvent): void => {
            if(pressedKey.key === "Tab"){
                pressedKey.preventDefault();
                const currentFocusID = focusedInputID;
                updateFocusID((currentFocusID+1)%4);
            }
            if (pressedKey.key === "Enter") {
                try {
                    validateInput()
                } catch (rawError) {
                    const message = (rawError as ValidationError).message
                    enqueueSnackbar(message, { variant: "error" })
                }
            }
        }

        document.addEventListener("keydown", handlePressedKey)

        return () => { document.removeEventListener("keydown", handlePressedKey); }
    }, [fieldValue])

    return (
        <div className="newElementDialog">
            <MockedDataGridSelector
                id="inputType"
                name="Data type"
                updateValue={updateinputType}
                values={Filter.authorizedInputTypes}
                value={inputType}
                isFocused={focusedInputID===0}
            />
            <MockedDataGridSelector
                id="fieldName"
                name="Field name"
                updateValue={updateFieldName}
                value={fieldName}
                values={Filter.inputFieldName(inputType as "File" | "Library")}
                isFocused={focusedInputID===1}
            />
            <MockedDataGridSelector
                id="comparisonOperator"
                name="Type of comparison"
                updateValue={updateComparison}
                value={comparison}
                values={Filter.authorizedComparisonOperationsString}
                isFocused={focusedInputID===2}
            />
            <MockedDataGridFieldValue
                fieldType={Filter.getFieldNameType(inputType, fieldName)}
                fieldValue={fieldValue}
                updateValue={updateValue}
                isFocused={focusedInputID===3}
            />
            <MockedNewFilterButton addNewFilter={validateInput} />
        </div>
    )
}