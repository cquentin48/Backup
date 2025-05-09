import React from "react";

import Icon from "@mdi/react";
import { mdiCpu64Bit, mdiCalendarPlusOutline, mdiCalendarSync } from "@mdi/js";

import { Memory, Storage } from "@mui/icons-material";
import { Grid2 } from "@mui/material";

import { useSelector } from "react-redux";

import DeviceStat from "./computerStat";

import { deviceState } from "../../../../controller/deviceMainInfos/loadDeviceSlice";
import '../../../../../res/css/ComputerMainInfos.css';
import Device from "../../../../model/device/device";
import SnapshotID from "../../../../model/device/snapshotId";

/**
 * Accordion containing the device main informations
 * @returns {React.JSX.Element} Accordion with the device main informations
 */
export default function SpecsMainInfos (): React.JSX.Element {
    const { device } = useSelector(deviceState)
    const firstSnapshot = device !== undefined ? device.snapshots[0] : undefined
    const lastSnapshot = device !== undefined ? device.snapshots[device.snapshots.length - 1] : undefined

    return (
        <Grid2 container spacing={2} id="deviceMainInfosSpecs">
            <DeviceStat
                avatar={
                    <Icon path={mdiCpu64Bit} size={1} />
                }
                label="Processor"
                value={device !== undefined ? device.processor : ""}
            />

            <DeviceStat
                avatar={
                    <Memory />
                }
                label="Computer cores"
                value={device !== undefined ? device.cores.toString() : ""}
            />

            <DeviceStat
                avatar={
                    <Storage />
                }
                label="RAM"
                value={device !== undefined ? Device.formatBytes(device.memory) : ""}
            />
            <DeviceStat
                avatar={
                    <Icon path={mdiCalendarPlusOutline} size={1} />
                }
                label="Device added on"
                value={
                    firstSnapshot !== undefined
                        ? SnapshotID.localizedDate(firstSnapshot.date)
                        : ""
                }
            />
            <DeviceStat
                avatar={
                    <Icon path={mdiCalendarSync} size={1} />
                }
                label="Last update"
                value={
                    lastSnapshot !== undefined
                        ? SnapshotID.localizedDate(lastSnapshot.date)
                        : ""
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
