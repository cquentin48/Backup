import { Add } from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";
import { useEffect } from "react";

/**
 * Filter added function passed from the form
 */
interface DeviceMainInfosFilterCreationButtonProps {
    /**
     * Adds a new filter inside the filter in the device main informations filters
     */
    addNewFilter: () => void;
}

/**
 * Filter appending for the device main informations
 * @param {DeviceMainInfosFilterCreationButtonProps} props Filter appending passed from the form
 * @returns {JSX.Element} Button dom element
 */
export default function DeviceMainInfosFilterCreationButton
    (props: DeviceMainInfosFilterCreationButtonProps): JSX.Element {
    useEffect(()=>{
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                props.addNewFilter()
            }
        })
    })
    return (
        <Tooltip title="Adds new filter">
            <IconButton
                aria-label="add"
                onClick={() => {
                    console.log("Button clicked!")
                    props.addNewFilter();
                }}
            >
                <Add />
            </IconButton>
        </Tooltip>
    )
}