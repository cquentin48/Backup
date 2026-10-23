import { ChangeEventHandler, forwardRef, ReactNode } from "react";

// Jest `Select` mock function from the material library
const mockedSelect = forwardRef(({ id, labelID, label, onChange, children, inputRef }:
    { id: string, labelID: string, label: string, onChange: ChangeEventHandler, children: Array<ReactNode>, inputRef: (ref: never) => void }, ref: any) => (
    <div>
        <div id={labelID}>{label}</div>
        <select
            onChange={onChange}
            id={id}
            ref={ref ?? inputRef}
        >
            {
                children.map((input) => input)
            }
        </select>
    </div>
));

export default mockedSelect;