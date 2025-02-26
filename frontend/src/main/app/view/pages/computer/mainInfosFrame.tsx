import React, { useEffect } from "react";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, Paper, Skeleton } from "@mui/material";

import { enqueueSnackbar } from "notistack";

import FormatsPieCharts from "./sections/Formats";

import type Device from "../../../model/device/device";

import '../../../../res/css/ComputerMainInfos.css';

import { fetchSnapshot } from "../../../model/queries/computer/loadSnapshot";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../../../controller/store";
import { deviceState } from "../../../controller/deviceMainInfos/loadDeviceSlice";
import { snapshotState } from "../../../controller/deviceMainInfos/loadSnapshotSlice";

/**
 * Main informations frame view component
 * @returns {React.JSX.Element} Rendered view component
 */
export default function MainInfosFrame (): React.JSX.Element {
    const dispatch = useDispatch<AppDispatch>()

    const [snapshotID, setSnapshotID] = React.useState("")

    const { deviceLoading, device, deviceError } = useSelector(deviceState)
    const { snapshotError } = useSelector(snapshotState)

    /**
     * Update the selected snapshot
     * @param {string} newSnapshotID ID of the snapshot selected
     */
    const updateSelectedSnapshot = (newSnapshotID: string): void => {
        setSnapshotID(newSnapshotID)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        console.log(`Dispatch : ${dispatch}`)
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
                    {(snapshot).localizedDate()}
                </MenuItem>
            )
        })
        const menuEntries: React.JSX.Element[] = [];
        snapshotLists.forEach((snapshotList: Map<string, React.JSX.Element>, operatingSystem: string) => {
            menuEntries.push(
                <MenuItem disabled>
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
            updateSelectedSnapshot((device).snapshots[0].key)
        }
    }, [dispatch, snapshotID, device])

    if (snapshotError !== "" || (deviceError !== undefined && deviceError.message !== "")) {
        if (deviceError !== undefined && deviceError.message !== "") {
            enqueueSnackbar(
                deviceError.message, { variant: deviceError.variant }
            )
        } else {
            enqueueSnackbar(
                snapshotError, { variant: "error" }
            )
        }
        snapshots = <FormControl id="mainInfosSelectForm">
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
                    <MenuItem disabled>
                        Error : impossible to fetch data
                    </MenuItem>
                }
            </Select>
        </FormControl>
    } else if (deviceLoading) {
        snapshots = <Skeleton variant="rounded" width={256} height={56} id="mainInfosSelectForm" />
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
