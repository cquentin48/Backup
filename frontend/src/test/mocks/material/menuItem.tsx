import { forwardRef } from "react";


// Jest mock select `menuItem` function
const mockedMenuItem = forwardRef(({ value, children }: { value: string, children: string },ref) => (
    <option value={value}>
        {children}
    </option>
));

export default mockedMenuItem;