import { useSnackbar } from "notistack";
import ValidationError from "../../../main/app/model/exception/errors/validationError";

/**
 * Filter adding function passed from the form
 */
interface MockedNewFilterButtonProps {
    /**
     * Mocked function adding new filter (empty here, just validating the inputs, the value added is done in the unit test)
     */
    addNewFilter: () => void;
}

/**
 * New filter addition mocked button
 * @param {MockedNewFilterButtonProps} props Filter addition button
 * @returns {React.JSX.Element} Mounted mocked component
 */
export default function MockedNewFilterButton (props: MockedNewFilterButtonProps): React.JSX.Element {
    const { enqueueSnackbar } = useSnackbar();

    return (
        <button
            onClick={() => {
                try {
                    props.addNewFilter()
                }
                catch (error) {
                    const message = (error as ValidationError).message;

                    enqueueSnackbar(message, { variant: "error" })
                }
            }}
        >Adds new filter</button>
    )
}