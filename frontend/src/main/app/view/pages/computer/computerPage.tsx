import React from 'react';

import DeviceMainInfos from './mainInfos';
import DeviceElements from './computerElements';
import { useParams } from 'react-router-dom';
import { loadDevice } from '../../controller/deviceMainInfos/loadDevice';
import { Box, CircularProgress, Modal } from '@mui/material';


/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
export default function ComputerPage (): React.JSX.Element {
    const [loadedDevice, setLoadedDevice] = React.useState<boolean>(false);

    /**
     * Device load operation result method
     * @param {string} resultData Operating result data (none here)
     */
    const loadedDeviceOpResult = (resultData: string) => {
        console.log("Loaded device!")
        setLoadedDevice(true)
    }
    loadDevice.addObservable("computerPage", loadedDeviceOpResult)

    const { id } = useParams()
    loadDevice.performAction(id as string)

    if (loadedDevice) {
        return (
            <div id="DeviceMainInfosPage">
                <DeviceMainInfos />
                <DeviceElements />
            </div>
        )
    }
    return (
        <div id="DeviceMainInfosPage">
            <Modal open={!loadedDevice}>
                <Box>
                    <CircularProgress size={260}/>
                    Loading device
                </Box>
            </Modal>
        </div>
    )
}

/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
/*export default function ComputerPage (): React.JSX.Element {
    const { id } = useParams()
    const dataRetriever = new ComputerInfos();
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
                dataManager.addElement("selectedDevice", deviceInfos)
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
            <DeviceMainInfos />
            <DeviceElements />
        </div>
    )
}*/
