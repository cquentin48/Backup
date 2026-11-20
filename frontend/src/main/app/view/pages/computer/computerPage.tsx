import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import DeviceMainInfos from './mainInfos';
import DeviceElements from './computerElements';
import { useParams } from 'react-router-dom';

import LoadingDeviceModal from './DeviceModal';
import { type AppDispatch } from '../../../controller/store';
import { fetchDeviceInfos } from '../../../model/queries/computer/deviceInfos';
import DeviceNotFound from './notFound/notFoundTitle';
import { deviceState } from '../../../controller/deviceMainInfos/loadDeviceSlice';

/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
export default function ComputerPage (): React.JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { deviceLoading, device, deviceError } = useSelector(deviceState);

    const { id } = useParams();
    const lastDeviceID = useRef<string | null>(null);

    const [currentSnapshotID, setCurrentSnapshotID] = React.useState<string>("");

    useEffect(() => {
        if (id === undefined || id === lastDeviceID.current) return;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        lastDeviceID.current = id;
        dispatch(fetchDeviceInfos({
            deviceID: id
        }));
    }, [id]);

    if (deviceError === undefined || (deviceError !== undefined && deviceError.message === "")) {
        if (!deviceLoading && device !== undefined) {
            document.title = `Backup - device ${device.name}`
        } else {
            document.title = "Backup - loading device"
        }
        return (
            <div id="DeviceMainInfosPage">
                <LoadingDeviceModal />
                <DeviceMainInfos currentSnapshotID={currentSnapshotID}/>
                <DeviceElements
                    setCurrentSnapshotID={setCurrentSnapshotID}
                    previousCurrentSnapshotID={currentSnapshotID}
                />
            </div>
        )
    }
    document.title = "Backup - unknown device"
    return (
        <DeviceNotFound />
    )
}
