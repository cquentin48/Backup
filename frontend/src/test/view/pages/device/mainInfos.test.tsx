import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import DeviceMainInfos from '../../../../main/app/view/pages/computer/mainInfos';
import Device from '../../../../main/app/model/device/device';
import SnapshotID from '../../../../main/app/model/device/snapshotId';

import '@testing-library/jest-dom'
import { dataManager } from '../../../../main/app/model/AppDataManager';

describe("Device main Infos unit test suite", () => {
    afterEach(() => {
        dataManager.removeAllData()
    })
    test("Successful render (non Ubuntu OS)", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "My OS!"
            )]
        )
        dataManager.setElement("device", testDevice)

        // Acts
        const { container } = render(<DeviceMainInfos device={testDevice}/>)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(testDevice.snapshots[0].operatingSystem))

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(testDevice.name)
        expect(renderedDeviceHeaderButton).not.toBeNull()
        expect(renderedDeviceHeaderButton).toHaveTextContent("Delete device")
    })

    test("Successful render Ubuntu OS", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        )
        dataManager.setElement("device", testDevice)

        // Acts
        const { container } = render(<DeviceMainInfos device={testDevice}/>)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(testDevice.snapshots[0].operatingSystem))

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(testDevice.name)
        expect(renderedDeviceHeaderButton).not.toBeNull()
        expect(renderedDeviceHeaderButton).toHaveTextContent("Delete device")
    })
})
