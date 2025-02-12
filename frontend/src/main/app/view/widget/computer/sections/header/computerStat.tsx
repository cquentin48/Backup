import React from "react";

import { Grid2, Card, CardHeader, Avatar, CardContent, Skeleton } from "@mui/material";

import "../../../../../../res/css/ComputerMainInfos.css";

/**
 * Elements passed from the device main infos header
 */
interface DeviceStatProps {
    /**
     * If the device has been loaded
     */
    deviceLoaded: boolean

    /**
     * Card icon
     */
    avatar: React.JSX.Element & React.ReactNode

    /**
     * Card title label
     */
    label: string

    /**
     * Card associated value
     */
    value: string
}

/**
 * Device stat card display
 * @param {DeviceStatProps} props device stats props passed from the device list component
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceStat (props: DeviceStatProps): React.JSX.Element {
    let avatar;
    let value;
    let label;
    if (!props.deviceLoaded) {
        avatar = <Skeleton variant="circular" width={40} height={40} />
        value = <Skeleton variant="rounded" width={"100%"} height={50} />
        label = <Skeleton variant="rounded" width={"100%"} height={40} />
    } else {
        avatar = props.avatar;
        value = props.value;
        label = props.label;
    }
    return (
        <Grid2 size={{ md: 2 }}>
            <Card className="DeviceSpecsCard">
                <CardHeader avatar={
                    <Avatar>
                        {avatar}
                    </Avatar>
                }
                    title={label}
                />
                <CardContent>
                    {value}
                </CardContent>
            </Card>
        </Grid2>
    )
}
