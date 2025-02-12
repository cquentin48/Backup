import { mdiUbuntu, mdiMicrosoftWindows } from "@mdi/js";
import Icon from "@mdi/react";
import { Delete } from "@mui/icons-material";
import { Tooltip, Typography, Button, Skeleton } from "@mui/material";
import React from "react";

import "../../../../res/css/ComputerMainInfos.css";

/**
 * Device name and operating system passed from the device main page header
 */
interface DeviceMainInfosHeaderProps {
    /**
     * Device operating system name
     */
    operatingSystem: string | undefined

    /**
     * Device name
     */
    name: string | undefined

    isDeviceLoaded: boolean
}

/**
 * Device header containing OS icon, computer name and delete button
 * @param {DeviceMainInfosHeaderProps} props components passed from the device main page header
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceMainInfosHeader (props: DeviceMainInfosHeaderProps): React.JSX.Element {
    /**
     * Fetch the correct icon from the mdi labs
     * @param {string} os Device operating system
     * @returns {string} Operating system linked icon
     */
    const getOSIcon = (os: string): string => {
        if (os.toLowerCase().includes("ubuntu")) {
            return mdiUbuntu;
        } else {
            return mdiMicrosoftWindows;
        }
    }

    let icon;
    let name;
    let deleteButton;

    if (props.isDeviceLoaded) {
        icon =
            <Icon
                id="DeviceMainInfosOSIcon"
                path={getOSIcon(props.operatingSystem as string)} size={2}
            />
        name = props.name as string
        deleteButton =
            <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                id="deleteDeviceButton"
            >
                Delete device
            </Button>
    } else {
        icon = <Skeleton variant="circular" width={40} height={40} />
        name = <Skeleton variant="rounded" width={228} height={42} />
        deleteButton = <Skeleton
            variant="rounded"
            width={172}
            height={51}
            id="deleteDeviceButton"
        />
    }

    return (
        <div id="deviceMainInfosHeader">
            <div id="computerName">
                <Tooltip title={props.operatingSystem} placement='top'>
                    <div id="OSIcon">
                        {icon}
                    </div>
                </Tooltip>
                <Typography variant="h4">
                    {name}
                </Typography>
            </div>
            {deleteButton}
        </div>
    )
}
