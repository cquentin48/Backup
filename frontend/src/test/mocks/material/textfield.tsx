import { ChangeEventHandler, forwardRef } from "react"

import { TextField } from "@mui/material";

/**
 * Element passed from the TextField element in the `MUI` library into the mocked input
 * @see{@link TextField} Base element
 */
interface MockedTextFieldProps {
    /**
     * Input DOM element ID
     */
    id: string;

    /**
     * When input is changed
     */
    onChange: ChangeEventHandler;

    /**
     * Input label
     */
    label: string;

    /**
     * If the input is automatically focused
     */
    autoFocus?: boolean;

    /**
     * Input type (e.g. text, password, number, ...)
     */
    type: string;

    /**
     * Input DOM element reference initialisation method
     * @param {never} ref DOM element reference
     */
    inputRef: (ref: never) => void;

    /**
     * Label helper text
     */
    helperText: boolean | string;
};

// Jest Material.UI `TextField` mock function
const mockedTextField = forwardRef((
    { id, onChange, label, autoFocus, type, inputRef, helperText }: MockedTextFieldProps,
    ref: any) => (
    <div>
        <div id={`${id}-label`}>
            {label}
        </div>
        <input
            autoFocus={autoFocus !== undefined ? autoFocus : false}
            type={type}
            id={id}
            onChange={onChange}
            ref={ref ?? inputRef}
        />{
            helperText ?? <div id={`${id}helper`}>{helperText}</div>
        }
    </div>
))

export default mockedTextField;