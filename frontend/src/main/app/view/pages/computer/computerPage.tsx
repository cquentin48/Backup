import React from 'react';

import gqlClient from '../../../model/queries/client';
import getDeviceInfos from '../../../../res/queries/computer_infos.graphql';
import ComputerMainInfos from './mainInfos';
import ComputerInfos from '../../../model/queries/computer/computerInfos';
import type Device from '../../../model/device/device';
import ComputerElements from './computerElements';
import { useParams } from 'react-router-dom';

/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
export default function ComputerPage (): React.JSX.Element {
    const { id } = useParams()
    const dataRetriever = new ComputerInfos();
    const [device, setDevice] = React.useState<Device | null>(null);
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
                }
            );
        }, []);
    }
    if (device === null) {
        return (
            <p>Loading device informations...</p>
        )
    } else {
        return (
            <div id="ComputerMainInfosPage">
                <ComputerMainInfos computer={device} />
                <ComputerElements computer={device} />
            </div>
        )
    }
}
