import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import DeviceMainInfos from '../../../../main/app/view/pages/computer/mainInfos';
import Device from '../../../../main/app/model/device/device';
import SnapshotID from '../../../../main/app/model/device/snapshot';

import '@testing-library/jest-dom'

describe("Device main Infos unit test suite", () => {
    test("Successful render (non Ubuntu OS)", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            "My OS",
            [new SnapshotID(
                "1",
                "2020-01-01",
                "My OS!"
            )]
        )

        // Acts
        const { container } = render(<DeviceMainInfos
            device={testDevice}
        />)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(testDevice.operatingSystem))

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
            "Ubuntu",
            [new SnapshotID(
                "1",
                "2020-01-01",
                "My OS!"
            )]
        )

        // Acts
        const { container } = render(<DeviceMainInfos
            device={testDevice}
        />)
        const renderedDeviceHeader = container.querySelector("#deviceMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(testDevice.operatingSystem))

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(testDevice.name)
        expect(renderedDeviceHeaderButton).not.toBeNull()
        expect(renderedDeviceHeaderButton).toHaveTextContent("Delete device")
    })
})
