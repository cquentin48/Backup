import { ChangeEventHandler, forwardRef, ReactNode } from "react";

import { Select } from "@mui/material";

/**
 * Props passed from the Select element in the `MUI` library
 * @see{@link Select} Base element
 */
interface MockedSelectProps {
    /**
     * Select DOM element id
     */
    id: string;

    /**
     * Select DOM element label ID
     */
    labelId: string;

    /**
     * Select label
     */
    label: string;

    /**
     * Action triggered when an element is selected
     */
    onChange: ChangeEventHandler;

    /**
     * Select menu options
     */
    children: Array<ReactNode>;

    /**
     * Reference method triggered
     * @param {never} ref DOM element reference
     */
    inputRef: (ref: never) => void
};

// Jest `Select` mock function from the material library
const mockedSelect = forwardRef((
    { id, labelId, label, onChange, children, inputRef }: MockedSelectProps,
    ref: any) => (
    <div>
        <div id={labelId}>{label}</div>
        <select
            onChange={onChange}
            id={id}
            ref={ref ?? inputRef}
        >
            {
                children.constructor.name === "Array" ? children.map((input) => input) : children
            }
        </select>
    </div>
));

export default mockedSelect;