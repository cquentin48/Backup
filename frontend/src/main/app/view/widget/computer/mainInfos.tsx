import React from "react";
import type Device from "../../../model/device/device";

import Icon from '@mdi/react';
import { mdiClockOutline } from '@mdi/js';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Paper } from "@mui/material";

import Formats from "./sections/Formats";
import '../../../../res/css/ComputerMainInfos.css';
import { loadSnapshot } from "../../controller/deviceMainInfos/loadSnapshot";
import SnapshotID from "../../../model/device/snapshot";

/**
 * Main informations frame props interface
 */
interface MainInfosFrameProps {
    /**
     * Device selected for its main information to be displayed in the web component
     */
    computer: Device
}

/**
 * State of the main information frame
 */
interface MainInfosFrameState {
    /**
     * Type of package
     */
    packageType: string
}

/**
 * Main informations frame view component
 * @param {MainInfosFrameProps} props Selected device passed from the {ComputerElement} view page.
 * @returns {React.JSX.Element} View component
 */
export default class MainInfosFrame extends React.Component<MainInfosFrameProps, MainInfosFrameState> {
    state: Readonly<MainInfosFrameState> = {
        packageType: ''
    }

    /**
     * Update the type of package
     * @param {string} newPackageType New package type
     */
    setPackageType = (newPackageType: string): void => {
        this.setState({
            packageType: newPackageType
        })
    }

    componentDidMount (): void {
        loadSnapshot.performAction(JSON.stringify("1"))
    }

    /**
     * Render frame
     * @returns {React.JSX.Element} View component
     */
    render (): React.JSX.Element {
        const handleChange = (event: SelectChangeEvent): void => {
            this.setPackageType(event.target.value);
        };

        const state = this.state;
        const props = this.props;

        return (
            <div id="mainInfosTable">
                <div id="mainInfosTableSelectHeader">
                    <Icon path={mdiClockOutline} size={1} />
                    <FormControl id="mainInfosSelectForm">
                        <InputLabel id="dataType">Save date</InputLabel>
                        <Select
                            labelId="dataType-label"
                            data-testid="dataType-select"
                            id="dataType-select"
                            value={state.packageType}
                            onChange={handleChange}
                            autoWidth
                        >
                            {/* Add here the list with the updates */}
                            <MenuItem value={10}><Icon path={mdiClockOutline} size={1} />Librairies</MenuItem>
                            {
                                props.computer.snapshots.map((snapshot, index) => {
                                    return (
                                        <MenuItem key={index} value={(snapshot as SnapshotID).id}>
                                            {snapshot?.localizedDate()}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                <Paper elevation={2} id="detailsContainer">
                    <Formats />
                </Paper>
            </div>
        );
    }

}
