import React from "react";
import Device from "../../../model/device/device";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, Paper } from "@mui/material";

import FormatsPieCharts from "./sections/Formats";
import { loadSnapshot } from "../../controller/deviceMainInfos/loadSnapshot";
import { SnapshotData } from "../../../model/snapshot/snapshotData";

import '../../../../res/css/ComputerMainInfos.css';

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
    snapshot: SnapshotData | undefined;

}

interface MainInfosFrameProps {
    device: Device;
}

/**
 * Main informations frame view component
 * @param {MainInfosFrameProps} props Selected device passed from the {ComputerElement} view page.
 * @returns {React.JSX.Element} View component
 */
export default class MainInfosFrame extends React.Component<MainInfosFrameProps, MainInfosFrameState> {
    constructor (props: MainInfosFrameProps) {
        super(props);
        this.state = {
            snapshots: [],
            selectedSnapshot: "",
            snapshot: undefined
        }
    }

    componentDidMount (): void {
        const props = this.props;
        this.setState({
            selectedSnapshot: props.device.snapshots[0].id,
        })
        loadSnapshot.addObservable("MainInfosFrame", this.updateSnapshotViewData)
        loadSnapshot.performAction(JSON.stringify((this.props.device as Device).snapshots[0].id))
    }

    /**
     * Update the selected snapshot
     * @param {string} snapshotID ID of the snapshot selected
     */
    updateSelectedSnapshot = (snapshotID: string): void => {
        this.setState({
            selectedSnapshot: snapshotID
        })
        loadSnapshot.performAction(JSON.stringify(this.state.selectedSnapshot))
    }

    /**
     * Method triggered when the snapshots are loaded
     * @param {string} data Stringified JSON data passed from a GRAPHQL query in the backend
     */
    updateSnapshotViewData = (data: string): void => {
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
        const snapshotList = this.buildMenuItems(device);
        const snapshots =
            <FormControl id="mainInfosSelectForm">
                <InputLabel id="dataType">Snapshot list</InputLabel>
                <Select
                    labelId="dataType-label"
                    data-testid="dataType-select"
                    id="dataType-select"
                    value={selectedSnapshot}
                    onChange={(e) => { this.updateSelectedSnapshot(e.target.value); }}
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
                    <FormatsPieCharts device={device}/>
                </Paper>
            </div>
        );
    }
}
