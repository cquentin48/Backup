import React, { ReactNode } from "react";

import { Delete } from "@mui/icons-material";
import { Tooltip, Typography, Button, Skeleton } from "@mui/material";

import { useSelector } from "react-redux";

import "../../../../../res/css/ComputerMainInfos.css";
import { deviceState } from "../../../../controller/deviceMainInfos/loadDeviceSlice";
import { Linux, Windows } from "iconoir-react";

/**
 * Device header containing OS icon, computer name and delete button
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceMainInfosHeader (): React.JSX.Element {
    const { device } = useSelector(deviceState)

    /**
     * Fetch the correct icon from the mdi labs
     * @param {string} os Device operating system
     * @returns {string} Operating system linked icon
     */
    const getOSIcon = (os: string): any => {
        const svgElementID = "DeviceMainInfosOSIcon";
        if (os.toLowerCase().includes("ubuntu")) {
            return <Linux id={svgElementID} />;
        } else {
            return <Windows id={svgElementID} /> as ReactNode;
        }
    }

    let deviceOSIcon;
    let deviceTitle;
    let deleteDeviceButton;

    if (device !== undefined) {
        const icon = getOSIcon(device.snapshots[0].operatingSystem);
        deviceOSIcon = <div id="OSIcon">
            <Tooltip title={device.snapshots[0].operatingSystem} placement='top'>
                {icon}
            </Tooltip>
        </div>
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
