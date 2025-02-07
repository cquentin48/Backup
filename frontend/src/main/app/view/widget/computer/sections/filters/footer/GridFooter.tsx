import React, { type JSX } from "react";

import { type GridSlotsComponentsProps } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { updateDeviceMainInfosFilter } from "../../../../../controller/deviceMainInfos/updateSelectedFilters";
import GridFooterDelete from "./GridFooterDel";

import '../../../../../../../res/css/Filters.css'

/**
 * Device main informations footer web component state
 */
interface DeviceMainInfosGridFooterState {
    /**
     * Ids of selected filters
     */
    idsList: number[]
}

/**
 * Device main infos datagrid footer
 */
export default class DeviceMainInfosGridFooter extends React.Component<
    NonNullable<GridSlotsComponentsProps['footer']>, DeviceMainInfosGridFooterState
> {
    /**
     * Device main infos grid footer web component initialisation
     * @param {NonNullable<GridSlotsComponentsProps['footer']>} props Elements passed from the datagrid
     */
    constructor (props: NonNullable<GridSlotsComponentsProps['footer']>) {
        super(props);
        this.state = {
            idsList: []
        }
    }

    componentDidMount (): void {
        updateDeviceMainInfosFilter.addObservable('deviceMainInfosFooter', this.handleUpdatedSelectedRows)
    }

    componentWillUnmount (): void {
        updateDeviceMainInfosFilter.removeObservable('deviceMainInfosFooter')
    }

    /**
     * Handles the footer based off the selected element in datagrid
     * @param {string} ids Selected filter ids
     */
    handleUpdatedSelectedRows = (ids: string): void => {
        this.setState({
            idsList: JSON.parse(ids) as number[]
        })
    }

    /**
     * Render web component
     * @returns {React.JSX.Element} Rendered component
     */
    render (): JSX.Element {
        const ids = this.state.idsList
        const formatedFiltersCount = ids.length + "filtre" + (ids.length > 1) && "s" +
            " sélectionné" + (ids.length > 1) && "s"
        if (ids.length > 0) {
            return (
                <Box
                    sx={{ p: 1, display: 'flex' }}
                    id="GridFooterContent"
                >
                    <p>{formatedFiltersCount}!</p>
                    <GridFooterDelete selectedIds={ids} />
                </Box>
            )
        } else {
            return <div id="GridFooterNoContent"></div>
        }
    }
}
