import React from "react";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { enUS } from "@mui/x-date-pickers/locales";

import { TextField } from "@mui/material";
import dayjs from "dayjs";

import '../../../../../../../res/css/Filters.css';

/**
 * Props passed from the form
 */
interface FieldValueProps {
    /**
     * Filter Field condition current value in the input field
     */
    value: string

    /**
     * If the user hasn't typed a value yet in the input field (``true``) or not (``false``)
     */
    firstTime: boolean

    /**
     * Name of the field for the filter to be applied on
     */
    fieldName: string

    /**
     * Filter value input type (e.g. ``text`` or ``number``)
     */
    getfieldNameType: string

    /**
     * Tell the software the user has already typed something (used for validation)
     * @param {boolean} newStatus New status
     */
    updateFirstTime: (newStatus: boolean) => void

    /**
     * Updates the value from the input field into the form data for the filter appending operation
     * @param {string} newValue
     */
    updateValue: (newValue: string) => void

    /**
     * Link the input reference to the form for the focus switch with the ``TAB`` key
     * @param {number} input Div input element for the focus
     * @param {never} i Input index in the form
     */
    initInputRef: (input: never, i: number) => void

    /**
     * Form input index used for the focus
     */
    index: number
}

/**
 * Input field for the filter value
 * @param {FieldValueProps} props Props passed from the new filter form
 * @returns {React.JSX.Element} rendered input field value
 */
export default function FieldValue (props: FieldValueProps): React.JSX.Element {
    if (props.getfieldNameType !== "date") {
        const helperText = props.value.length === 0 && !props.firstTime && "You must enter a value here!";
        return (
            <TextField
                id="deviceMainInfosFilterValueField"
                label="Field value"
                variant="standard"
                type={props.getfieldNameType}
                error={props.value.length === 0 && !props.firstTime}
                helperText={helperText}
                onChange={(newValue:
                React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (props.firstTime) {
                        props.updateFirstTime(false);
                    }
                    props.updateValue(
                        newValue.target.value
                    )
                }}
                autoFocus
                inputRef={(input: never) => { props.initInputRef(input, props.index); }}
            />
        )
    } else {
        const updateFieldValue = (e: any): void => {
            const date: string = e.$d.toLocaleDateString([],
                { year: "numeric", month: "2-digit", day: "2-digit" }
            )
            props.updateValue(date)
        }
        return (
            <LocalizationProvider
                localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
                dateAdapter={AdapterDayjs}
            >
                <div id="datePicker">
                    <DatePicker
                        label="Field value"
                        onAccept={(pickedDateEvent: any) => { updateFieldValue(pickedDateEvent); }}
                        onChange={(typedDateEvent) => { updateFieldValue(typedDateEvent); }}
                        defaultValue={
                            dayjs(new Date())
                        }
                        maxDate={dayjs(new Date())}
                        autoFocus
                        inputRef={(input: never) => { props.initInputRef(input, props.index); }}
                        slotProps={{
                            textField: {
                                variant: "standard",
                                id: "deviceMainInfosFilterValueField"
                            }
                        }}
                    />
                </div>
            </LocalizationProvider>
        )
    }
}
