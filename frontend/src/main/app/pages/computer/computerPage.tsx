import React from 'react';

import gqlClient from '../../model/queries/client';
import typedefs from '../../../res/queries/computer_infos.graphql';
import ComputerMainInfos from './mainInfos';
import ComputerInfos from '../../model/queries/computer/computerInfos';
import { useParams } from 'react-router-dom';
import type Computer from '../../model/computer/computer';

interface ComputerPageProps {
    graphqlQueryOperationManager: typeof gqlClient
}

export default function ComputerPage (props: ComputerPageProps): JSX.Element {
    const { id } = useParams()
    const dataRetriever = new ComputerInfos()
    const [device, setDevice] = React.useState<Computer | null>(null);
    React.useEffect(() => {
        (async () => {
            const deviceInfos = await dataRetriever.compute_query(
                gqlClient,
                typedefs.kind,
                Object({
                    deviceID: id
                })
            )
            setDevice(deviceInfos.data)
        })().catch(
            error => {
                console.error(error)
            }
        );
    }, []);

    if (device === null) {
        return (
            <p>Loading device informations...</p>
        )
    } else {
        return (
            <div>
                <ComputerMainInfos computer={device} />
            </div>
        )
    }
}
