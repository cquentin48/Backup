import { mdiUbuntu, mdiMicrosoftWindows } from "@mdi/js";
import Icon from "@mdi/react";
import { Delete } from "@mui/icons-material";
import { Tooltip, Typography, Button } from "@mui/material";
import React from "react";

import type Device from "../../../../model/device/device";
import "../../../../../res/css/ComputerMainInfos.css";
import { useSelector } from "react-redux";
import { type AppState } from "../../../controller/store";

/**
 * Device header containing OS icon, computer name and delete button
 * @param {DeviceMainInfosProps} props loaded device from the device page component
 * @returns {React.JSX.Element} rendered component
 */
export default function DeviceMainInfosHeader (): React.JSX.Element {
    const device = useSelector((state: AppState) => state.device.device) as Device

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

    return (
        <div id="deviceMainInfosHeader">
            <div id="computerName">
                <Tooltip title={device.snapshots[0].operatingSystem} placement='top'>
                    <div id="OSIcon">
                        <Icon
                            id="DeviceMainInfosOSIcon"
                            path={getOSIcon(device.snapshots[0].operatingSystem)} size={2}
                        />
                    </div>
                </Tooltip>
                <Typography variant="h4">
                    {device.name}
                </Typography>
            </div>
            <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                id="deleteDeviceButton"
            >
                Delete device
            </Button>
        </div>
    )
}
