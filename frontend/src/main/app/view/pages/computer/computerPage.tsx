import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import DeviceMainInfos from './mainInfos';
import DeviceElements from './computerElements';
import { useParams } from 'react-router-dom';

import DeviceMainInfosSkeleton from './skeleton/DeviceMainInfos';
import MainInfosFrameSkeleton from './skeleton/DeviceMainInfosFrame';
import LoadingDeviceModal from './skeleton/DeviceModal';
import { type AppDispatch, type AppState } from '../../controller/store';
import { fetchDeviceInfos } from '../../../model/queries/computer/deviceInfos';
import DeviceNotFound from './notFound/notFoundTitle';

/**
 * Computer page view model
 * @returns {React.JSX.Element} Page component in the web application
 */
export default function ComputerPage (): React.JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, device, error } = useSelector((app: AppState) => app.device)

    const { id } = useParams()

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch(fetchDeviceInfos({
            deviceID: id
        }))
    }, [dispatch, id])

    if (!loading && device !== undefined) {
        document.title = `Backup - device ${device.name}`
        return (
            <div id="DeviceMainInfosPage">
                <DeviceMainInfos />
                <DeviceElements />
            </div>
        )
    } else if (!loading && device === undefined && error !== undefined) {
        document.title = "Backup - unknown device"
        return (
            <DeviceNotFound />
        )
    } else {
        document.title = "Backup - loading device"
        return (
            <div id="DeviceMainInfosPage">
                <LoadingDeviceModal />
                <DeviceMainInfosSkeleton />
                <MainInfosFrameSkeleton />
            </div>
        )
    }
}
