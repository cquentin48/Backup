import React from 'react';

import DeviceMainInfos from './mainInfos';
import DeviceElements from './computerElements';
import { useParams } from 'react-router-dom';
import { loadDevice } from '../../controller/deviceMainInfos/loadDevice';
import Device from '../../../model/device/device';

import DeviceMainInfosSkeleton from './skeleton/DeviceMainInfos';
import MainInfosFrameSkeleton from './skeleton/DeviceMainInfosFrame';
import LoadingDeviceModal from './skeleton/DeviceModal';
import { useSnackbar } from 'notistack';
import { Box, Typography } from '@mui/material';

/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
export default function ComputerPage (): React.JSX.Element {
    const [device, setDevice] = React.useState<Device>();
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar()

    /**
     * Device load operation result method
     * @param {string} resultData Operating result data (none here)
     */
    const loadedDeviceOpResult = (resultData: string): void => {
        try {
            if(Object.hasOwn(JSON.parse(resultData), "errorType")){
                const errorData = (JSON.parse(resultData) as any)['data']
                throw errorData
            }
            const device = Device.fromJSON(resultData)
            setDevice(device)
            document.title = `Backup - device ${device.name}`
        } catch (e) {
            if ((e as Error).name !== 'NotFoundError') {
                enqueueSnackbar(JSON.stringify(e), { variant: "error" })
            }
            document.title = "Backup - unknown device"
        } finally {
            setLoaded(true)
        }
    }

    loadDevice.addObservable("computerPage", loadedDeviceOpResult)

    const { id } = useParams()
    loadDevice.performAction(JSON.stringify(parseInt(id as string)))
    if (device != null) {
        return (
            <div id="DeviceMainInfosPage">
                <DeviceMainInfos device={device} />
                <DeviceElements device={device} />
            </div>
        )
    } else if (loaded && device === undefined) {
        return (
            <div id="DeviceMainInfosPage">
                <Typography variant='h1'>
                    404 - Device not found
                </Typography>

                <Box sx={{
                    bgcolor: "#ff7c60",
                    width: "fit-content",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "absolute",
                    top: "25%",
                    left: "50%",
                    transform: "translate(-50%, -25%)",
                    padding: "12px",
                    borderRadius: "16px"
                }}>
                    <Typography variant='h4'>
                        The device you are looking for is unavailable right now.
                        Please check if the device ID you passed is correct.
                        <br />
                        If you think the device ID you entered is correct, please contact your
                        administrator quickly.
                    </Typography>
                </Box>
            </div>
        )
    } else {
        return (
            <div id="DeviceMainInfosPage">
                <LoadingDeviceModal />
                <DeviceMainInfosSkeleton />
                <MainInfosFrameSkeleton />
            </div>
        )
    }
}
