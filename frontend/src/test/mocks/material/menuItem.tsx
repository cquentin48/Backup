import { forwardRef } from "react";

import { MenuItem } from "@mui/material";

/**
 * Props items from the `MenuItem` used for the mock
 * 
 * @see{@link MenuItem} For the related props
 */
interface MockedMenuItemProps {
    /**
     * Select item value used in the functions
     */
    value: string;

    /**
     * Label appearing in the select menu
     */
    children: string;

    /**
     * If the element is disabled or not
     */
    disabled: boolean;
}

/**
 * Jest mock select `menuItem` function
 * @see{@link MenuItem} Based component
 */
const mockedMenuItem = forwardRef(({ value, children, disabled }: MockedMenuItemProps, ref) => (
    disabled ? 
    <option value={value} disabled>
        {children}
    </option> :
    <option value={value}>
        {children}
    </option>
));

export default mockedMenuItem;