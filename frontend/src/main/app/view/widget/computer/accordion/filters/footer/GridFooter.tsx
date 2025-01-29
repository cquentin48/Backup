import { JSX } from "react";

import { GridSlotsComponentsProps, useGridApiContext } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function DeviceMainInfosGridFooter(props: NonNullable<GridSlotsComponentsProps['footer']>): JSX.Element {
    const apiRef = useGridApiContext();
    const selectedRows = apiRef.current!.getSelectedRows()
    return (
        <Box sx={{p:1, display:'flex'}}>
            <p>Actuellement {`${selectedRows.values.length}`} sélectionnées!</p>
        </Box>
    )
}