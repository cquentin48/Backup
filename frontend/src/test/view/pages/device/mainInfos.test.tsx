import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import ComputerMainInfos from '../../../../main/app/view/pages/computer/mainInfos';
import Device from '../../../../main/app/model/device/device';
import SnapshotID from '../../../../main/app/model/device/snapshot';

import '@testing-library/jest-dom'

describe("Device main Infos unit test suite", () => {
    test("Successfull render (non Ubuntu OS)", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            "My OS",
            [new SnapshotID(
                "1",
                "2020-01-01"
            )]
        )

        // Acts
        const { container } = render(<ComputerMainInfos
            computer={testDevice}
        />)
        const renderedDeviceHeader = container.querySelector("#computerMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(testDevice.operatingSystem))

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(testDevice.name)
        expect(renderedDeviceHeaderButton).not.toBeNull()
        expect(renderedDeviceHeaderButton).toHaveTextContent("Delete device")
    })

    test("Successfull render Ubuntu OS", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            "Ubuntu",
            [new SnapshotID(
                "1",
                "2020-01-01"
            )]
        )

        // Acts
        const { container } = render(<ComputerMainInfos
            computer={testDevice}
        />)
        const renderedDeviceHeader = container.querySelector("#computerMainInfosHeader")
        const renderedDeviceHeaderButton = container.querySelector(".MuiButtonBase-root")

        fireEvent.mouseOver(screen.getByLabelText(testDevice.operatingSystem))

        // Asserts
        expect(renderedDeviceHeader).toHaveTextContent(testDevice.name)
        expect(renderedDeviceHeaderButton).not.toBeNull()
        expect(renderedDeviceHeaderButton).toHaveTextContent("Delete device")
    })
})
