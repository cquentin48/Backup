import React from "react";

import { mdiUbuntu, mdiMicrosoftWindows } from "@mdi/js";
import Icon from "@mdi/react";
import { Delete } from "@mui/icons-material";
import { Tooltip, Typography, Button, Skeleton } from "@mui/material";

import { useSelector } from "react-redux";

import "../../../../../res/css/ComputerMainInfos.css";
import { deviceState } from "../../../../controller/deviceMainInfos/loadDeviceSlice";

/**
 * Device header containing OS icon, computer name and delete button
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceMainInfosHeader (): React.JSX.Element {
    const { device, deviceError: error, deviceLoading: loading } = useSelector(deviceState)

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

    let deviceOSIcon;
    let deviceTitle;
    let deleteDeviceButton;

    if (!loading && (error === undefined || error.message !== "") && device !== undefined) {
        deviceOSIcon = <Tooltip title={device.snapshots[0].operatingSystem} placement='top'>
            <div id="OSIcon">
                <Icon
                    id="DeviceMainInfosOSIcon"
                    path={getOSIcon(device.snapshots[0].operatingSystem)} size={2}
                />
            </div>
        </Tooltip>
        deviceTitle = <Typography variant="h4">
            {device.name}
        </Typography>
        deleteDeviceButton = <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            id="deleteDeviceButton"
        >
            Delete device
        </Button>
    } else {
        deviceOSIcon = <Skeleton variant="circular" width={40} height={40} id="OSIcon" />
        deviceTitle = <Skeleton variant="text"><Typography variant="h4">Device name</Typography></Skeleton>
        deleteDeviceButton = <Skeleton variant="rounded" width={172} height={51}
            id="deleteDeviceButton">
            <Button />
        </Skeleton>
    }

    return (
        <div id="deviceMainInfosHeader">
            <div id="computerName">
                {deviceOSIcon}
                {deviceTitle}
            </div>
            {deleteDeviceButton}
        </div>
    )
}
