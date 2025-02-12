import React from "react";

import Icon from "@mdi/react";
import { mdiCpu64Bit, mdiCalendarPlusOutline, mdiCalendarSync } from "@mdi/js";

import { Memory, Storage } from "@mui/icons-material";
import { Grid2 } from "@mui/material";

import type Device from "../../../../model/device/device";
import '../../../../../res/css/ComputerMainInfos.css';
import DeviceStat from "./header/computerStat";

/**
 * Device selected for the main informations display
 */
interface AccordionMainInfosProps {
    computer: Device
}

/**
 * Accordion containing the device main informations
 * @param {AccordionMainInfosProps} props computer linked to the widget
 * @returns {React.JSX.Element} Accordion with the device main informations
 */
export default function SpecsMainInfos (props: AccordionMainInfosProps): React.JSX.Element {
    const computer = props.computer;
    const firstSnapshot = computer.snapshots[0]
    const lastSnapshot = computer.snapshots[computer.snapshots.length - 1]

    return (
        <div id="deviceMainInfos">
            <Grid2 container spacing={2} sx={{ padding: "0em 1em 0em 1em" }}>
                <DeviceStat
                    deviceLoaded={props.computer !== undefined}
                    avatar={
                        <Icon path={mdiCpu64Bit} size={1} />
                    }
                    label="Processor"
                    value={computer.processor}
                />

                <DeviceStat
                    deviceLoaded={props.computer !== undefined}
                    avatar={
                        <Memory />
                    }
                    label="Computer cores"
                    value={(computer.cores.toString())}
                />

                <DeviceStat
                    deviceLoaded={props.computer !== undefined}
                    avatar={
                        <Storage />
                    }
                    label="RAM"
                    value={computer.memory.toString()}
                />
                <DeviceStat
                    deviceLoaded={props.computer !== undefined}
                    avatar={
                        <Icon path={mdiCalendarPlusOutline} size={1} />
                    }
                    label="Device added on"
                    value={
                        firstSnapshot.uploadDate.toLocaleDateString(window.navigator.language, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })
                    }
                />
                <DeviceStat
                    deviceLoaded={props.computer !== undefined}
                    avatar={
                        <Icon path={mdiCalendarSync} size={1} />
                    }
                    label="Last update"
                    value={
                        lastSnapshot.uploadDate.toLocaleDateString(window.navigator.language, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })
                    }
                />
                <DeviceStat
                    deviceLoaded={props.computer !== undefined}
                    avatar={
                        <Storage />
                    }
                    label="Storage"
                    value="Amount of storage here used in the backup server"
                />
            </Grid2>
        </div>
    )
}
