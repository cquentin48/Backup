import React from "react";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface FilterToolbarProps{
    selectedValue: string;
    updateSelectedValue: (input:any) => void;
    initInputRef: (ref:never, formInputID:number)=>void;
    inputID: number
    selectedItem: string[];
    selectID: string;
    selectLabel: string;
}

export default function FilterToolbar (props: FilterToolbarProps): React.JSX.Element {
    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id={`${props.selectID}Label`}>Input type</InputLabel>
            <Select
                id={props.selectID}
                labelId={`${props.selectID}Label`}
                value={props.selectedValue}
                label={props.selectLabel}
                onChange={(newInputType) => 
                    props.updateSelectedValue(newInputType.target.value)
                }
                inputRef={(ref:never)=>props.initInputRef(ref, props.inputID)}
            >
                {
                    props.selectedItem.map((value:string, index:number) => {
                        return (
                            <MenuItem value={value} key={index}>{value}</MenuItem>
                        )
                    })
                }
            </Select>
        </FormControl>
    )
}