import React from 'react';

import gqlClient from '../../../model/queries/client';
import getDeviceInfos from '../../../../res/queries/computer_infos.graphql';
import DeviceMainInfos from './mainInfos';
import ComputerInfos from '../../../model/queries/computer/computerInfos';
import type Device from '../../../model/device/device';
import DeviceElements from './computerElements';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
export default function ComputerPage (): React.JSX.Element {
    const { id } = useParams()
    const dataRetriever = new ComputerInfos();
    const [device, setDevice] = React.useState<Device | undefined>(undefined);
    if (getDeviceInfos.loc !== null) {
        const query = getDeviceInfos;
        React.useEffect(() => {
            (async () => {
                const deviceInfos = await dataRetriever.compute_query(
                    gqlClient,
                    query,
                    {
                        deviceID: id as string
                    }
                )
                setDevice(deviceInfos)
            })().catch(
                error => {
                    console.error(error)
                    enqueueSnackbar(error, { variant: "error" })
                }
            );
        }, []);
    }
    return (
        <div id="DeviceMainInfosPage">
            <DeviceMainInfos device={device} />
            <DeviceElements device={device} />
        </div>
    )
}
