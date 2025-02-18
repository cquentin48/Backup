import React from "react";

import Icon from "@mdi/react";
import { mdiCpu64Bit, mdiCalendarPlusOutline, mdiCalendarSync } from "@mdi/js";

import { Memory, Storage } from "@mui/icons-material";
import { Grid2 } from "@mui/material";

import '../../../../../res/css/ComputerMainInfos.css';
import type Device from "../../../../model/device/device";
import DeviceStat from "./computerStat";

interface SpecsMainInfosProps {
    device: Device
}

/**
 * Accordion containing the device main informations
 * @param {SpecsMainInfosProps} props Loaded device from the device page component
 * @returns {React.JSX.Element} Accordion with the device main informations
 */
export default function SpecsMainInfos (props: SpecsMainInfosProps): React.JSX.Element {
    const device = props.device
    const firstSnapshot = device.snapshots[0]
    const lastSnapshot = device.snapshots[device.snapshots.length - 1]

    return (
        <Grid2 container spacing={2} id="deviceMainInfosSpecs">
            <DeviceStat
                avatar={
                    <Icon path={mdiCpu64Bit} size={1} />
                }
                label="Processor"
                value={(device).processor}
            />

            <DeviceStat
                avatar={
                    <Memory />
                }
                label="Computer cores"
                value={((device).cores.toString())}
            />

            <DeviceStat
                avatar={
                    <Storage />
                }
                label="RAM"
                value={(device).formatBytes((device).memory)}
            />
            <DeviceStat
                avatar={
                    <Icon path={mdiCalendarPlusOutline} size={1} />
                }
                label="Device added on"
                value={
                    (firstSnapshot).uploadDate.toLocaleDateString(window.navigator.language, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })
                }
            />
            <DeviceStat
                avatar={
                    <Icon path={mdiCalendarSync} size={1} />
                }
                label="Last update"
                value={
                    (lastSnapshot).uploadDate.toLocaleDateString(window.navigator.language, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })
                }
            />
            <DeviceStat
                avatar={
                    <Storage />
                }
                label="Storage"
                value="Amount of storage here used in the backup server"
            />
        </Grid2>
    )
}
