import React from "react";

import { Skeleton, Typography } from "@mui/material";

/**
 * Device main informations skeleton. Rendered before device data is loaded
 * @returns {React.JSX.Element} rendered web component
 */
export default function DeviceMainInfosHeaderSkeleton (): React.JSX.Element {
    return (
        <div id="deviceMainInfosHeader">
            <div id="computerName">
                <Skeleton variant="circular" width={40} height={40} />
                <Typography variant="h4">
                    <Skeleton variant="rounded" width={228} height={42} />
                </Typography>
            </div>
            <Skeleton
                variant="rounded"
                width={172}
                height={51}
                id="deleteDeviceButton"
            />
        </div>
    )
}
