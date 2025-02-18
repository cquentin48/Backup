import React from "react";

import { Grid2 } from "@mui/material";
import DeviceStatSkeleton from "./DeviceStat";

/**
 * Device specifications main information skeleton (before the device data is loaded)
 * @returns {React.JSX.Element} Rendered web component
 */
export default function DeviceSpecsMainInfosSkeleton (): React.JSX.Element {
    const deviceStats = []
    for (let i = 0; i < 5; i++) {
        deviceStats.push(<DeviceStatSkeleton/>)
    }
    return (
        <Grid2 container spacing={2} id="deviceMainInfosSpecs">
            {deviceStats}
        </Grid2>
    )
}
