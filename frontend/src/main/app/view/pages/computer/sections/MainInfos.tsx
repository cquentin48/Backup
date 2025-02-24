import React from "react";

import Icon from "@mdi/react";
import { mdiCpu64Bit, mdiCalendarPlusOutline, mdiCalendarSync } from "@mdi/js";

import { Memory, Storage } from "@mui/icons-material";
import { Grid2 } from "@mui/material";

import '../../../../../res/css/ComputerMainInfos.css';
import type Device from "../../../../model/device/device";
import DeviceStat from "./computerStat";
import { useSelector } from "react-redux";
import { type AppState } from "../../../controller/store";

/**
 * Accordion containing the device main informations
 * @returns {React.JSX.Element} Accordion with the device main informations
 */
export default function SpecsMainInfos (): React.JSX.Element {
    const device = useSelector((state: AppState) => state.device.device) as Device
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
                    (firstSnapshot).date.toLocaleDateString(window.navigator.language, {
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
                    (lastSnapshot).date.toLocaleDateString(window.navigator.language, {
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
