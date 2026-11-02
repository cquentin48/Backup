import { forwardRef } from "react";

import { MenuItem } from "@mui/material";


/**
 * Jest mock select `menuItem` function
 * @see{@link MenuItem} Based component
 */
const mockedMenuItem = forwardRef(({ value, children }: { value: string, children: string },ref) => (
    <option value={value}>
        {children}
    </option>
));

export default mockedMenuItem;