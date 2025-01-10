import React from 'react';

import gqlClient from '../../model/queries/client';
import getDeviceInfos from '../../../res/queries/computer_infos.graphql';
import ComputerMainInfos from './mainInfos';
import ComputerInfos from '../../model/queries/computer/computerInfos';
import { useParams } from 'react-router-dom';
import type Computer from '../../model/computer/computer';
import ComputerElements from './computerElements';

/**
 * Props interface for the computer page
 */
interface ComputerPageProps {
    graphqlQueryOperationManager: typeof gqlClient
}

/**
 * Computer page view model
 * @param props props passed from the App component (None here)
 * @returns Page component in the web application
 */
export default function ComputerPage (props: ComputerPageProps): JSX.Element {
    const { id } = useParams()
    const dataRetriever = new ComputerInfos();
    const [device, setDevice] = React.useState<Computer | null>(null);
    if(getDeviceInfos.loc !== null){
        const query = getDeviceInfos.loc?.source.body;
        React.useEffect(() => {
            (async () => {
                const deviceInfos = await dataRetriever.compute_query(
                    gqlClient,
                    query ?? "",
                    {
                        deviceID:'1'
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
            <div>
                <ComputerMainInfos computer={device} />
                <ComputerElements computer={device} />
            </div>
        )
    }
}
