import dayjs from "dayjs";
import { DateUtils } from "../../view/utils/date";

// Jest Material.UI DatePicker mock functions
//jest.mock("@mui/x-date-pickers", () => {
const mockedDatePickers = () => {
    return {
        ...jest.requireActual("@mui/x-date-pickers"),
        DatePicker: ({ label, defaultValue, maxDate, onChange, onAccept, slotProps, autoFocus, ref, inputRef }) => (
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
        )
    }
};

export default mockedDatePickers;