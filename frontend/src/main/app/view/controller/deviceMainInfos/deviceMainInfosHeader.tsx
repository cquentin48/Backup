import { mdiUbuntu, mdiMicrosoftWindows } from "@mdi/js";
import Icon from "@mdi/react";
import { Delete } from "@mui/icons-material";
import { Tooltip, Typography, Button, Skeleton } from "@mui/material";
import React from "react";

import "../../../../res/css/ComputerMainInfos.css";
import { dataManager } from "../../../model/AppDataManager";
import Device from "../../../model/device/device";

/**
 * Device header containing OS icon, computer name and delete button
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceMainInfosHeader (): React.JSX.Element {
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
    const deviceLoaded = dataManager.isdataElementContained("device")
    let icon;
    let name;
    let deleteButton;

    if (deviceLoaded) {
        const device = JSON.parse(dataManager.getElement("device")) as Device
        icon =
            <Tooltip title={device.snapshots[0].operatingSystem} placement='top'>
                <div id="OSIcon">
                    <Icon
                        id="DeviceMainInfosOSIcon"
                        path={getOSIcon(device.snapshots[0].operatingSystem as string)} size={2}
                    />
                </div>
            </Tooltip>
        name =
            <Typography variant="h4">
                {device.name as string}
            </Typography>
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
                {icon}
                <Typography variant="h4">
                    {name}
                </Typography>
            </div>
            {deleteButton}
        </div>
    )
}
