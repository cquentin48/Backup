import React, { useEffect } from "react";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, Paper, Skeleton } from "@mui/material";

import { useSnackbar } from "notistack";

import FormatsPieCharts from "./sections/Formats";

import type Device from "../../../model/device/device";

import '../../../../res/css/ComputerMainInfos.css';

import { fetchSnapshot } from "../../../model/queries/computer/loadSnapshot";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../controller/store";
import { deviceState } from "../../../controller/deviceMainInfos/loadDeviceSlice";
import { snapshotState } from "../../../controller/deviceMainInfos/loadSnapshotSlice";
import SnapshotID from "../../../model/device/snapshotId";

/**
 * Main informations frame view component
 * @returns {React.JSX.Element} Rendered view component
 */
export default function MainInfosFrame (): React.JSX.Element {
    const dispatch = useDispatch<AppDispatch>()

    const [snapshotID, setSnapshotID] = React.useState("")

    const { device, deviceError, deviceLoading } = useSelector(deviceState)
    const { snapshotError } = useSelector(snapshotState)

    const { enqueueSnackbar } = useSnackbar()

    /**
     * Update the selected snapshot
     * @param {string} newSnapshotID ID of the snapshot selected
     */
    const updateSelectedSnapshot = (newSnapshotID: string): void => {
        setSnapshotID(newSnapshotID)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch(fetchSnapshot({
            snapshotID: newSnapshotID
        }))
    }

    /**
     * Build the Select snapshot Menu items
     * @param {Device} device Currently selected device
     * @returns {React.JSX.Element[]} Rendered menu items
     */
    const buildMenuItems = (device: Device): React.JSX.Element[] => {
        const snapshotLists: Map<string, Map<string, React.JSX.Element>> =
            new Map<string, Map<string, React.JSX.Element>>();
        device.snapshots.forEach(snapshot => {
            if (!snapshotLists.has(snapshot.operatingSystem)) {
                snapshotLists.set(snapshot.operatingSystem, new Map())
            }
            const snapshotEntry = snapshotLists.get(snapshot.operatingSystem) as Map<string, React.JSX.Element>;
            snapshotEntry.set(
                snapshot.key,
                <MenuItem key={snapshot.key} value={(snapshot).key}>
                    {SnapshotID.localizedDate(snapshot.date)}
                </MenuItem>
            )
        })
        const menuEntries: React.JSX.Element[] = [];
        snapshotLists.forEach((snapshotList: Map<string, React.JSX.Element>, operatingSystem: string) => {
            menuEntries.push(
                <MenuItem disabled key={`OSSelector${operatingSystem}`}>
                    {operatingSystem}
                </MenuItem>
            )
            snapshotList.forEach((snapshotMenuItem: React.JSX.Element) => {
                menuEntries.push(snapshotMenuItem)
            })
        })
        return menuEntries
    }

    let snapshots;

    useEffect(() => {
        if (!deviceLoading && device !== undefined) {
            const newID = snapshotID !== "" ? snapshotID : device.snapshots[0].key
            updateSelectedSnapshot(newID)
        }
    }, [dispatch, snapshotID, device])

    if (snapshotError.message !== "" || deviceError.message !== "") {
        useEffect(() => {
            if (deviceError.message !== "") {
                enqueueSnackbar(
                    deviceError.message, { variant: deviceError.variant }
                )
            } else {
                enqueueSnackbar(
                    snapshotError.message, { variant: snapshotError.variant }
                )
            }
        }, [deviceError, snapshotError])

        snapshots = <FormControl id="mainInfosSelectForm">
            <InputLabel id="dataType">Snapshot list</InputLabel>
            <Select
                labelId="dataType-label"
                data-testid="dataType-select"
                id="dataType-select"
                value={snapshotID}
                autoWidth
            >
                {
                    <MenuItem disabled key="failure">
                        Error : impossible to fetch data
                    </MenuItem>
                }
            </Select>
        </FormControl>
    } else if (deviceLoading) {
        snapshots = <Skeleton variant="rounded" width={256} height={56} id="mainInfosSelectForm" sx={{
            marginLeft: "8px"
        }} />
    } else if (!deviceLoading && device !== undefined) {
        const snapshotMenuItems = buildMenuItems(device);
        snapshots =
            <FormControl id="mainInfosSelectForm">
                <InputLabel id="dataType">Snapshot list</InputLabel>
                <Select
                    labelId="dataType-label"
                    data-testid="dataType-select"
                    id="dataType-select"
                    value={snapshotID}
                    onChange={(e) => { updateSelectedSnapshot(e.target.value); }}
                    autoWidth
                >
                    {
                        snapshotMenuItems
                    }
                </Select>
            </FormControl>
    }

    return (
        <div id="mainInfosTable">
            <div id="mainInfosTableSelectHeader">
                <Icon path={mdiClockOutline} size={1} />
                {snapshots}
            </div>
            <Paper elevation={2} id="detailsContainer">
                <FormatsPieCharts />
            </Paper>
        </div>
    );
}
