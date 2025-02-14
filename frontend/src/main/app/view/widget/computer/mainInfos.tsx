import React from "react";
import Device from "../../../model/device/device";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, Paper, Skeleton } from "@mui/material";

import Formats from "./sections/Formats";
import '../../../../res/css/ComputerMainInfos.css';
import { loadSnapshot } from "../../controller/deviceMainInfos/loadSnapshot";
import { type SnapshotData } from "../../../model/snapshot/snapshotData";
import { dataManager } from "../../../model/AppDataManager";
import { loadDevice } from "../../controller/deviceMainInfos/loadDevice";

/**
 * State of the main information frame
 */
interface MainInfosFrameState {
    /**
     * Type of package
     */
    snapshots: SnapshotData[]

    /**
     * Currently selected package
     */
    selectedSnapshot: string
    
}

interface MainInfosFrameProps{
    device: Device | null;
}

/**
 * Main informations frame view component
 * @param {MainInfosFrameProps} props Selected device passed from the {ComputerElement} view page.
 * @returns {React.JSX.Element} View component
 */
export default class MainInfosFrame extends React.Component<MainInfosFrameProps, MainInfosFrameState> {
    constructor(props: MainInfosFrameProps){
        super(props);
        this.state = {
            snapshots: [],
            selectedSnapshot: ""
        }
    }

    componentDidMount (): void {
        const device = JSON.parse(dataManager.getElement("device")) as Device
        loadDevice.addObservable("MainInfosFrame", this.deviceLoaded)
        loadSnapshot.addObservable("MainInfosFrame", this.snapshotsLoaded)
    }

    deviceLoaded(output:string){
        loadSnapshot.performAction((this.props.device as Device).snapshots[0].id)
    }

    /**
     * Update the selected snapshot
     * @param {string} snapshotID ID of the snapshot selected
     */
    selectSnapshot = (snapshotID: string): void => {
        this.setState({
            selectedSnapshot: snapshotID
        })
        loadSnapshot.performAction(JSON.stringify(this.state.selectedSnapshot))
    }

    /**
     * Method triggered when the snapshots are loaded
     * @param {string} data Stringified JSON data passed from a GRAPHQL query in the backend
     */
    snapshotsLoaded = (data: string): void => {
        const snapshots = JSON.parse(data)
        const currentlySelectedSnapshotID = (this.props.device as Device).snapshots[0].id
        this.setState({
            snapshots: snapshots as SnapshotData[],
            selectedSnapshot: currentlySelectedSnapshotID
        })
    }

    /**
     * Build the Select snapshot Menu items
     * @param {Device} device Currently selected device
     * @returns {React.JSX.Element[]} Rendered menu items
     */
    buildMenuItems (device: Device): React.JSX.Element[] {
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
    render (): React.JSX.Element {
        const device = this.props.device;
        const { selectedSnapshot } = this.state;
        let icon;
        let snapshots;
        if (device === undefined) {
            icon = <Skeleton
                variant="circular"
                width={40}
                height={40}
                className="avatarIcon"
            />
            snapshots = <Skeleton variant="rounded" width={256} height={56} />
        } else {
            const device = this.props.device as Device
            icon = <Icon path={mdiClockOutline} size={1} />;
            const snapshotList = this.buildMenuItems(device);
            snapshots =
                <FormControl id="mainInfosSelectForm">
                    <InputLabel id="dataType">Snapshot list</InputLabel>
                    <Select
                        labelId="dataType-label"
                        data-testid="dataType-select"
                        id="dataType-select"
                        value={selectedSnapshot}
                        onChange={(e) => { this.selectSnapshot(e.target.value); }}
                        autoWidth
                    >
                        {
                            snapshotList
                        }
                    </Select>
                </FormControl>
        }

        return (
            <div id="mainInfosTable">
                <div id="mainInfosTableSelectHeader">
                    {icon}
                    {snapshots}
                </div>
                <Paper elevation={2} id="detailsContainer">
                    <Formats deviceLoaded={device !== undefined} />
                </Paper>
            </div>
        );
    }

}
