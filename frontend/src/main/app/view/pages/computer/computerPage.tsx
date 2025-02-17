import React from 'react';

import DeviceMainInfos from './mainInfos';
import DeviceElements from './computerElements';
import { useParams } from 'react-router-dom';
import { loadDevice } from '../../controller/deviceMainInfos/loadDevice';
import Device from '../../../model/device/device';

import DeviceMainInfosSkeleton from './skeleton/DeviceMainInfos';
import MainInfosFrameSkeleton from './skeleton/DeviceMainInfosFrame';
import DeviceModal from './skeleton/DeviceModal';


/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
export default function ComputerPage (): React.JSX.Element {
    const [device, setDevice] = React.useState<Device>();

    /**
     * Device load operation result method
     * @param {string} resultData Operating result data (none here)
     */
    const loadedDeviceOpResult = (resultData: string) => {
        const device = Device.fromJSON(resultData)
        setDevice(device)
    }
    loadDevice.addObservable("computerPage", loadedDeviceOpResult)

    const { id } = useParams()
    loadDevice.performAction(JSON.stringify(parseInt(id as string)))
    if (device) {
        return (
            <div id="DeviceMainInfosPage">
                <DeviceMainInfos device={device} />
                <DeviceElements device={device} />
            </div>
        )
    } else {
        return (
            <div id="DeviceMainInfosPage">
                <DeviceModal/>
                <DeviceMainInfosSkeleton />
                <MainInfosFrameSkeleton/>
            </div>
        )
    }
}