import React from "react";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import "../../../../../../../res/css/ComputerMainInfos.css";

interface FilterToolbarProps {
    selectedValue: string
    updateSelectedValue: (input: any) => void
    initInputRef: (ref: never, formInputID: number) => void
    inputID: number
    selectedItem: string[]
    selectID: string
    selectLabel: string
}

/**
 * Filter toolbar
 * @param {FilterToolbarProps} props Elements passed from the datagrid filter
 * @returns {React.JSX.Element} rendered DOM component
 */
export default function FilterToolbar (props: FilterToolbarProps): React.JSX.Element {
    return (
        <FormControl
            variant="standard"
            id="FilterToolbar">
            <InputLabel id={`${props.selectID}Label`}>{props.selectLabel}</InputLabel>
            <Select
                id={props.selectID}
                labelId={`${props.selectID}Label`}
                value={props.selectedValue}
                label={props.selectLabel}
                onChange={(newInputType) => { props.updateSelectedValue(newInputType.target.value); }
                }
                inputRef={(ref: never) => { props.initInputRef(ref, props.inputID); }}
            >
                {
                    props.selectedItem.map((value: string, index: number) => {
                        return (
                            <MenuItem value={value} key={index}>{value}</MenuItem>
                        )
                    })
                }
            </Select>
        </FormControl>
    )
}
