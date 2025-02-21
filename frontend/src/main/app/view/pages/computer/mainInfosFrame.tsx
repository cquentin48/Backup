import React, { useEffect } from "react";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, Paper } from "@mui/material";

import { useSnackbar } from "notistack";

import FormatsPieCharts from "./sections/Formats";

import type Device from "../../../model/device/device";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";

import '../../../../res/css/ComputerMainInfos.css';

import { loadSnapshot } from "../../controller/deviceMainInfos/loadSnapshotSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../controller/store";

/**
 * State of the main information frame
 */
interface MainInfosFrameState {
    /**
     * Type of package
     */
    snapshots: SnapshotData[]

    /**
     * Currently selected snapshot
     */
    selectedSnapshot: string

    /**
     * Current snapshot
     */
    snapshot: SnapshotData | undefined

}

interface MainInfosFrameProps {
    device: Device
}

/**
 * Main informations frame view component
 * @param {MainInfosFrameProps} props Selected device passed from the {ComputerElement} view page.
 * @returns {React.JSX.Element} View component
 */
export default function MainInfosFrame (props: MainInfosFrameProps): React.JSX.Element {
    const dispatch = useDispatch()

    const [snapshotID, setSnapshotID] = React.useState("")

    useEffect(()=>{
        dispatch (loadSnapshot(JSON.stringify((props.device).snapshots[0].id)))
    })

    /**
     * Update the selected snapshot
     * @param {string} newSnapshotID ID of the snapshot selected
     */
    const updateSelectedSnapshot = (newSnapshotID: string): void => {
        setSnapshotID(newSnapshotID)
        dispatch(loadSnapshot(JSON.stringify(snapshotID)))
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
                snapshot.id,
                <MenuItem key={snapshot.id} value={(snapshot).id}>
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

    /**
     * Render frame
     * @returns {React.JSX.Element} View component
     */
    const device = props.device;
    const snapshotList = buildMenuItems(device);
    const snapshots =
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
                    snapshotList
                }
            </Select>
        </FormControl>

    return (
        <div id="mainInfosTable">
            <div id="mainInfosTableSelectHeader">
                <Icon path={mdiClockOutline} size={1} />
                {snapshots}
            </div>
            <Paper elevation={2} id="detailsContainer">
                <FormatsPieCharts device={device} />
            </Paper>
        </div>
    );
}
