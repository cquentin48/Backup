import React, { type JSX } from "react";

import { Delete } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";

import { deleteFilter } from "../../../../../../controller/deviceMainInfos/filterSlice";

/**
 * Selected filtered ids passed from the device main infos footer
 */
interface GridFooterDeleteProps {
    /**
     * Selected filters id
     */
    selectedIds: number[]
}

/**
 * Delete button passed from the Device Main infos Grid footer
 * @param {GridFooterDeleteProps} props Selected filter ids passed from the footer
 * @returns {JSX.Element} Rendered DOM component
 */
export default function GridFooterDelete (props: GridFooterDeleteProps): JSX.Element {
    const dispatch = useDispatch()
    return (
        <Tooltip title="Delete filters">
            <Button startIcon={<Delete />}
                onClick={() => {
                    dispatch(
                        deleteFilter(
                            props.selectedIds
                        )
                    )
                }}>
                Delete filters
            </Button>
        </Tooltip>
    )
}
