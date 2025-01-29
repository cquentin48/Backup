import React from "react";
import { Delete } from "@mui/icons-material"
import { Button, Tooltip, Typography } from "@mui/material"
import Icon from '@mdi/react';
import {
    mdiMicrosoftWindows,
    mdiUbuntu
} from '@mdi/js';
import type Computer from "../../../model/computer/computer";

import '../../../../res/css/ComputerMainInfos.css';

/**
 * Props interface for the computer main information display component class
 */
interface ComputerMainInfosProps {
    computer: Computer
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
                <div id="computerMainInfosHeader" style={{
                    display: "flex"
                }}>
                    {/*
                    Computer specs
                    */}
                    <div id="computerName" style={{
                        textAlign: "left",
                        paddingLeft: "12px",
                        alignItems: "center",
                        display: "flex"
                    }}>
                        <Tooltip title={computer.operatingSystem} placement='top'>
                            <Icon path={this.getOSIcon(this.props.computer.operatingSystem)} size={2} />
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
