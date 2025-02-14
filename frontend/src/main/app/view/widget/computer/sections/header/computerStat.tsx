import React from "react";

import { Grid2, Card, CardHeader, Avatar, CardContent, Skeleton } from "@mui/material";

import "../../../../../../res/css/ComputerMainInfos.css";
import { dataManager } from "../../../../../model/AppDataManager";

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
    const avatar = props.avatar;
    const value = props.value;
    const label = props.label;
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
