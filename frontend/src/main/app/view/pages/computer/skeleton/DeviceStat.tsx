import React from "react";

import { Grid2, Card, CardHeader, Avatar, CardContent, Skeleton } from "@mui/material";

/**
 * Device stats cards skeleton component (before loading device data)
 * @returns {React.JSX.Element} rendered web component
 */
export default function DeviceStatSkeleton (): React.JSX.Element {
    return (
        <Grid2 size={{ md: 2 }}>
            <Card className="DeviceSpecsCard">
                <CardHeader avatar={
                    <Avatar>
                        <Skeleton variant="circular" width={40} height={40} />
                    </Avatar>
                }
                title={
                    <Skeleton variant="rounded" width="100%" height={40} />
                }
                />
                <CardContent>
                    <Skeleton variant="rounded" width="100%" height={60} />
                </CardContent>
            </Card>
        </Grid2>
    )
}
