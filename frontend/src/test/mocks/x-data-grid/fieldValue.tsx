import dayjs from "dayjs";
import React from "react";

/**
 * Field value data type, `onChange` value event listener and current value
 */
interface MockedDataGridFieldValueProps {
    /**
     * Field value data type
     */
    fieldType: string;

    /**
     * field value changed event listener
     * @param {string} value New value
     */
    updateValue: (value: string) => void;

    /**
     * Field current value
     */
    fieldValue: string;

    /**
     * If the input field (date or text) has to be focused
     */
    isFocused: boolean;
}

/**
 * New filter dialog value input in the mocked form
 * @param {MockedDataGridFieldValueProps} props field value data type, `onChange` value event listener and current value
 * @returns {React.JSX.Element} Mounted mocked DOM element
 */
export default function MockedDataGridFieldValue (
    props: MockedDataGridFieldValueProps): React.JSX.Element {
        //const ref:React.Ref<HTMLInputElement> = useRef(null);

    if (props.fieldType === "date") {
        const [hasBeenModified, updateModifyStatus] = React.useState(false);

        /**
         * From a date return a stringified date for the input DOM element
         * @param {dayjs.Dayjs} date Chosen date in the input
         * @returns {string} Stringified date
         */
        const getDateValue = (date: dayjs.Dayjs): string =>
            date.format("YYYY-DD-MM");

        return (
            <input type="date"
                name="Field value"
                placeholder="MM/DD/YYYY"
                max={getDateValue(dayjs(new Date()))}
                onChange={(e) => {
                    props.updateValue(e.target.value)
                    updateModifyStatus(true);
                }}
                data-testid="datePicker"
                value={
                    !hasBeenModified ? getDateValue(dayjs(new Date())) :
                        props.fieldValue
                }
            />
        )
    }

    return (
        <input type={props.fieldType}
            data-testid="deviceMainInfosFilterValueField"
            name="Field value"
            onChange={(e) => props.updateValue(e.target.value)}
            value={props.fieldValue}
        />
    )
}