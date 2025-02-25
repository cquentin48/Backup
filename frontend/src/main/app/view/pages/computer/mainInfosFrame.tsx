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
import { type AppDispatch, type AppState } from "../../controller/store";

/**
 * Main informations frame view component
 * @returns {React.JSX.Element} Rendered view component
 */
export default function MainInfosFrame (): React.JSX.Element {
    const dispatch = useDispatch<AppDispatch>()

    const [snapshotID, setSnapshotID] = React.useState("")

    const deviceState = useSelector((state: AppState) => state.device)
    const snapshotState = useSelector((state: AppState) => state.snapshot)

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
        if (!deviceState.loading && deviceState.device !== undefined) {
            updateSelectedSnapshot((deviceState.device).snapshots[0].key)
        }
    }, [dispatch, snapshotID, deviceState.device])

    if (snapshotState.error !== "" || (deviceState.error !== undefined && deviceState.error.message !== "")) {
        if (deviceState.error !== undefined && deviceState.error.message !== "") {
            enqueueSnackbar(
                deviceState.error.message, { variant: deviceState.error.variant }
            )
        } else {
            enqueueSnackbar(
                snapshotState.error, { variant: "error" }
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
    } else if (deviceState.loading) {
        snapshots = <Skeleton variant="rounded" width={256} height={56} id="mainInfosSelectForm"/>
    } else if (!deviceState.loading && deviceState.device !== undefined) {
        const snapshotMenuItems = buildMenuItems(deviceState.device);
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
