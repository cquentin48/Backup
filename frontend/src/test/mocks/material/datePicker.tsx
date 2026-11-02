import { forwardRef, ReactNode } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { FieldChangeHandlerContext } from "@mui/x-date-pickers/internals";

import { DateUtils } from "../../view/utils/date";

/**
 * Props used from the `DatePicker` component in the MUI Library
 */
interface MockedDatePickerProps {
    /**
     * Date label
     */
    label: string;

    /**
     * Date default value
     */
    defaultValue: object;

    /**
     * Latest possible date
     */
    maxDate: object;

    /**
     * When a date is changed
     * @param {object} value Changed date
     * @param {FieldChangeHandlerContext<object>} context If an error has been found
     */
    onChange: (value: object, context?: FieldChangeHandlerContext<object>) => void;

    /**
     * When a date changed has been accepted
     * @param {object} value Changed and accepted date
     * @param {FieldChangeHandlerContext<object>} context If an error has been found
     */
    onAccept: (value: object, context?: FieldChangeHandlerContext<object>) => void;

    /**
     * Props used in the child elements of the DatePicker (here the `TextField` only)
     */
    slotProps: object;

    /**
     * If the DatePicker is automatically focused
     */
    autoFocus: boolean;

    /**
     * Reference input action
     */
    inputRef: object;
};

/**
 * Jest Material.UI DatePicker mock functions
 * @see{@link DatePicker} Based element
 */
const mockedDatePicker = forwardRef((
    { label, defaultValue, maxDate, onChange, onAccept, slotProps, autoFocus, inputRef }: MockedDatePickerProps, ref: any):ReactNode => (
    <div>
        <div id={slotProps['textField']['id']}>{label}</div>
        <input
            type="date"
            max={DateUtils.formatDate(maxDate as Date)}
            defaultValue={DateUtils.formatDate(defaultValue as Date)}
            onChange={(e) => {
                const newValue = e.target.value ? dayjs(e.target.value) : null;
                if (newValue) {
                    onChange?.(newValue);
                }
            }}
            onBlur={(e) => {
                if (e.target.value) {
                    onAccept?.(dayjs(e.target.value));
                }
            }}
            ref={ref ?? inputRef}
            autoFocus={autoFocus}
        />
    </div>
));

export default mockedDatePicker;