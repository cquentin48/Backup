import React from "react";

import { Grid2, Card, CardHeader, Avatar, CardContent, Skeleton } from "@mui/material";

import { useSelector } from "react-redux";

import { deviceState } from "../../../../controller/deviceMainInfos/loadDeviceSlice";
import { snapshotState } from "../../../../controller/deviceMainInfos/loadSnapshotSlice";

import "../../../../../res/css/ComputerMainInfos.css";

/**
 * Elements passed from the device main infos header
 */
interface DeviceStatProps {
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
    const { device, deviceError: error } = useSelector(deviceState)
    const { snapshot, snapshotError } = useSelector(snapshotState)

    let avatar;
    let value;
    let label;

    if (device !== undefined && snapshot !== undefined) {
        avatar = props.avatar;
        value = props.value;
        label = props.label;
    } else if (error !== undefined || snapshotError !== "") {
        avatar = props.avatar
        label = props.label
        value = "Error in loading data"
    } else {
        avatar = <Skeleton variant="circular"><Avatar /></Skeleton>
        label = <Skeleton variant="text" width="100%" />
        value = <Skeleton variant="rounded" width="100%" height={72}/>
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
