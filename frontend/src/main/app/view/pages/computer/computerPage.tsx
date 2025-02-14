import React from 'react';

import DeviceMainInfos from './mainInfos';
import DeviceElements from './computerElements';
import { useParams, useNavigate } from 'react-router-dom';
import { loadDevice } from '../../controller/deviceMainInfos/loadDevice';
import Device from '../../../model/device/device';
import { dataManager } from '../../../model/AppDataManager';
import { Modal, Box, CircularProgress, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';


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
        setLoadedDevice(true)
    }
    loadDevice.addObservable("computerPage", loadedDeviceOpResult)

    const { id } = useParams()
    loadDevice.performAction(JSON.stringify(parseInt(id as string)))
    let device: Device | null;
    if (loadedDevice) {
        device = Device.fromJSON(dataManager.getElement("device"))
    } else {
        device = null
    }
    return (
        <div id="DeviceMainInfosPage">
            <Modal
                open={device === null}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%"
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#c2c2c2",
                        minWidth: "150px",
                        minHeight: "150px",
                        borderRadius: "22.5px",
                        padding: "16px",
                        alignItems: "center"
                    }}>
                        <CircularProgress size={120} />
                        <Typography variant="h4"
                            sx={{
                                marginTop: "16px"
                            }}
                        >
                            Loading device
                        </Typography>
                    </Box>
                </Box>
            </Modal>
            <DeviceMainInfos device={device} />
            <DeviceElements device={device} />
        </div>
    )
}