import React from "react";

import { render } from "@testing-library/react"
import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"

import '@testing-library/jest-dom'
import { dataManager } from "../../../../main/app/model/AppDataManager";
import SpecsMainInfos from "../../../../main/app/view/pages/computer/sections/MainInfos";

describe("Device main infos test suite", () => {
    test("Successful render with custom data", async () => {
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
        const { getByText } = render(<SpecsMainInfos/>)
        const opResult = getByText("Processor")
        let deviceSpecsContainer = opResult.parentElement as HTMLElement

        while (deviceSpecsContainer.id !== "deviceMainInfosSpecs") {
            deviceSpecsContainer = deviceSpecsContainer.parentElement as HTMLElement
        }

        const expectedOutputValues = [
            testDevice.processor,
            testDevice.cores.toString(),
            testDevice.formatBytes(testDevice.memory),
            (testDevice.snapshots[0]).localizedDate(),
            (testDevice.snapshots[0]).localizedDate(),
            "Amount of storage here used in the backup server"
        ]

        // Assert
        expectedOutputValues.forEach((expectedOutput: string, index: number) => {
            const cardValue = deviceSpecsContainer.children[index].children[0].children[1]
            expect(cardValue).toHaveTextContent(expectedOutput)
        })
    })
})
