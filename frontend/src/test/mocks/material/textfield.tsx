import { ChangeEventHandler, forwardRef } from "react"

// Jest Material.UI `TextField` mock function
//jest.mock('@mui/material/TextField', () => {
const mockedTextField = forwardRef(({
    id, onChange, label, autoFocus, type, inputRef, helperText
}: {
    id: string, onChange: ChangeEventHandler, label: string,
    autoFocus?: boolean, type: string, inputRef: (ref: never) => void,
    helperText: boolean | string
}, ref: any) => (
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