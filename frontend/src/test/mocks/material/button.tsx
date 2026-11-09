import { forwardRef, MouseEventHandler } from "react"
import { Button } from "@mui/material";

/**
 * Props passed from the `Button` element in the `MUI` library
 * @see{@link Button} Base element
 */
interface MockedButtonProps {
    /**
     * Name of the DOM element class
     */
    className: string;

    /**
     * Button label
     */
    children: string;

    /**
     * Action triggered when the button is pressed
     */
    onClick: MouseEventHandler

    /**
     * DOM element id
     */
    id: string;

    /**
     * Icon put at the start of the button
     */
    startIcon: React.JSX.Element
}

// Jest Material.UI `TextField` mock function
const mockedButton = forwardRef((
    { className, children, id, onClick, startIcon }: MockedButtonProps, ref: any) => (
    <button className={className} id={id} onClick={onClick}>
        {startIcon}{children}
    </button>
))

export default mockedButton;