import React from "react";
import { Delete } from "@mui/icons-material"
import { Button, Tooltip, Typography } from "@mui/material"
import Icon from '@mdi/react';
import {
    mdiMicrosoftWindows,
    mdiUbuntu
} from '@mdi/js';
import type Device from "../../../model/device/device";

import '../../../../res/css/ComputerMainInfos.css';
import SpecsMainInfos from "../../widget/computer/sections/MainInfos";

/**
 * Props interface for the computer main information display component class
 */
interface ComputerMainInfosProps {
    computer: Device
}

/**
 * Computer main informations display component class
 */
export default class ComputerMainInfos extends React.Component<ComputerMainInfosProps> {
    /**
     * Fetch the correct icon from the mdi labs
     * @param {string} os Device operating system
     * @returns {string} Operating system linked icon
     */
    getOSIcon (os: string): string {
        if (os.toLowerCase().includes("ubuntu")) {
            return mdiUbuntu;
        } else {
            return mdiMicrosoftWindows;
        }
    }

    render (): React.ReactNode {
        const computer = this.props.computer;
        return (
            <div id="computerMainInfos">
                <SpecsMainInfos computer={computer} />
                <div id="computerMainInfosHeader">
                    {/*
                    Computer specs
                    */}
                    <div id="computerName">
                        <Tooltip title={computer.operatingSystem} placement='top'>
                            <div id="OSIcon">
                                <Icon
                                    id="DeviceMainInfosOSIcon"
                                    path={this.getOSIcon(this.props.computer.operatingSystem)} size={2}
                                />
                            </div>
                        </Tooltip>
                        <Typography variant="h4">
                            {computer.name}
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        sx={{
                            marginLeft: "auto",
                            paddingRight: "-160px",
                            marginRight: "16px"
                        }}
                    >
                        Delete device
                    </Button>
                </div>
                <br />
            </div>
        )
    }
}
