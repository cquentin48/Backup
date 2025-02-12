import React from "react";
import type Device from "../../../model/device/device";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, Paper, Skeleton } from "@mui/material";

import Formats from "./sections/Formats";
import '../../../../res/css/ComputerMainInfos.css';
import { loadSnapshot } from "../../controller/deviceMainInfos/loadSnapshot";
import { SnapshotData } from "../../../model/snapshot/snapshotData";
import SnapshotID from "../../../model/device/snapshot";

/**
 * Main informations frame props interface
 */
interface MainInfosFrameProps {
    /**
     * Device selected for its main information to be displayed in the web component
     */
    device: Device | undefined
}

/**
 * State of the main information frame
 */
interface MainInfosFrameState {
    /**
     * Type of package
     */
    snapshots: SnapshotData[];
    selectedSnapshot: string;
    snapshotList: any[]
}

/**
 * Main informations frame view component
 * @param {MainInfosFrameProps} props Selected device passed from the {ComputerElement} view page.
 * @returns {React.JSX.Element} View component
 */
export default class MainInfosFrame extends React.Component<MainInfosFrameProps, MainInfosFrameState> {
    state: Readonly<MainInfosFrameState> = {
        snapshots: [],
        selectedSnapshot: "",
        snapshotList: []
    }

    formatSnapshots () {
        const snapshots: any = {}
        this.props.device?.snapshots.forEach((snapshot: SnapshotID) => {
            const operatingSystem = snapshot.operatingSystem
            const date = snapshot.uploadDate
            const id = snapshot.id
            if (!snapshots.includes(operatingSystem)) {
                snapshots.operatingSystem = []
            }
            snapshots.operatingSystem.push({
                uploadDate: date,
                id: id
            })
        });
        this.setState({
            snapshotList: snapshots
        })
    }

    /**
     * Update the type of package
     * @param {string} newPackageType New package type
     */
    selectSnapshot = (newPackageType: string): void => {
        this.setState({
            selectedSnapshot: newPackageType
        })
    }

    componentDidMount (): void {
        loadSnapshot.addObservable("MainInfosFrame", this.snapshotsLoaded)
        loadSnapshot.performAction(JSON.stringify("1"))
    }

    snapshotsLoaded (data: string): void {
        const snapshots = JSON.parse(data) as SnapshotData[]
        const currentlySelectedSnapshotID = (this.props.device as Device).snapshots[0].id
        this.setState({
            snapshots: snapshots,
            selectedSnapshot: currentlySelectedSnapshotID
        })
    }

    /**
     * Render frame
     * @returns {React.JSX.Element} View component
     */
    render (): React.JSX.Element {
        const { device } = this.props;
        const { selectedSnapshot, snapshotList: snapshotLists } = this.state;
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
            icon = <Icon path={mdiClockOutline} size={1} />;
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
                            snapshotLists.map((snapshot, index) => {
                                return (
                                    <div>
                                        <MenuItem value={index} disabled>
                                            {index}
                                        </MenuItem>
                                        {
                                            snapshot.map((singleSave:any, index:number) => {
                                                return (
                                                    <MenuItem key={index} value={(snapshot).id}>
                                                        {(singleSave).localizedDate()}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        <MenuItem value={10} disabled>
                            Saves
                        </MenuItem>
                        {
                            device.snapshots.map((snapshot, index) => {
                                return (
                                    <MenuItem key={index} value={(snapshot).id}>
                                        {(snapshot).localizedDate()}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
        }

        return (
            <div id="mainInfosTable">
                <div id="mainInfosTableSelectHeader">
                    {icon}
                    {snapshotLists}
                </div>
                <Paper elevation={2} id="detailsContainer">
                    <Formats deviceLoaded={device !== undefined} />
                </Paper>
            </div>
        );
    }

}
