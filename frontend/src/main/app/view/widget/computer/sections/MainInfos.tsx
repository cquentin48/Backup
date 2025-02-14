import React, { useEffect } from "react";

import Icon from "@mdi/react";
import { mdiCpu64Bit, mdiCalendarPlusOutline, mdiCalendarSync } from "@mdi/js";

import { Memory, Storage } from "@mui/icons-material";
import { Grid2 } from "@mui/material";

import Device from "../../../../model/device/device";
import '../../../../../res/css/ComputerMainInfos.css';
import DeviceStat from "./header/computerStat";
import SnapshotID from "../../../../model/device/snapshotId";

interface SpecsMainInfosProps{
    device: Device | null;
}

/**
 * Accordion containing the device main informations
 * @returns {React.JSX.Element} Accordion with the device main informations
 */
export default function SpecsMainInfos (props: SpecsMainInfosProps): React.JSX.Element {
    var device = props.device
    if(device === null){
        device = new Device()
    }
    var firstSnapshot = device.snapshots[0]
    var lastSnapshot = device.snapshots[device.snapshots.length-1]
    console.log(device)

    return (
        <Grid2 container spacing={2} id="deviceMainInfosSpecs">
            <DeviceStat
                avatar={
                    <Icon path={mdiCpu64Bit} size={1} />
                }
                label="Processor"
                value={(device as Device).processor}
            />

            <DeviceStat
                avatar={
                    <Memory />
                }
                label="Computer cores"
                value={((device as Device).cores.toString())}
            />

            <DeviceStat
                avatar={
                    <Storage />
                }
                label="RAM"
                value={(device as Device).formatBytes((device as Device).memory)}
            />
            <DeviceStat
                avatar={
                    <Icon path={mdiCalendarPlusOutline} size={1} />
                }
                label="Device added on"
                value={
                    (firstSnapshot as SnapshotID).uploadDate.toLocaleDateString(window.navigator.language, {
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
                    (lastSnapshot as SnapshotID).uploadDate.toLocaleDateString(window.navigator.language, {
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
