import React, { useEffect, useRef } from "react";

/**
 * Selector name, test-id, values, current value and `updateValue` event listener
 */
interface MockedDataGridSelectorProps{
    /**
     * Input name
     */
    name: string;

    /**
     * Input test id
     */
    id: string;

    /**
     * Possible values
     */
    values: string[];

    /**
     * Event listener for a selected value change
     * @param {React.SetStateAction<string>} value 
     */
    updateValue: (value: React.SetStateAction<string>) => void;

    /**
     * Current value
     */
    value: string;

    /**
     * If the input is currently focused
     */
    isFocused: boolean;
}

/**
 * Mounted mocked data grid dropdown input
 * @param {MockedDataGridSelectorProps} props Properties of the drop down (name, id, values, current value and when a new input is selected)
 * @returns {React.JSX.Element} mounted element
 */
export default function MockedDataGridSelector (props: MockedDataGridSelectorProps):React.JSX.Element {
    return (
        <select name={props.name}
            data-testid={props.id}
            onChange={(e)=>props.updateValue(e.target.value)}
            value={props.value}
        >
            {props.values.map((operator, index) => {
                return (<option
                    key={index}
                    value={operator}
                >
                    {operator}
                </option>)
            })}
        </select>
    )
}