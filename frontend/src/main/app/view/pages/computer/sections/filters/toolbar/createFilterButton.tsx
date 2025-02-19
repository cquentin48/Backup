import React from "react";

import { Add } from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";

/**
 * Filter added function passed from the form
 */
interface DeviceMainInfosFilterCreationButtonProps {
    /**
     * Adds a new filter inside the filter in the device main informations filters
     */
    addNewFilter: () => void
}

/**
 * Filter appending for the device main informations
 * @param {DeviceMainInfosFilterCreationButtonProps} props Filter appending passed from the form
 * @returns {React.JSX.Element} Button dom element
 */
export default function DeviceMainInfosFilterCreationButton
    (props: DeviceMainInfosFilterCreationButtonProps): React.JSX.Element {
    const { enqueueSnackbar } = useSnackbar()
    return (
        <Tooltip title="Adds new filter">
            <IconButton
                aria-label="add"
                onClick={() => {
                    try {
                        props.addNewFilter()
                    }
                    catch (error) {
                        enqueueSnackbar((error as any).message, { variant: (error as any).variant })
                    }
                }}
            >
                <Add />
            </IconButton>
        </Tooltip>
    )
}
