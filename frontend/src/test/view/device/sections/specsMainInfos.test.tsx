import React from "react";

import { render } from "@testing-library/react"
import Device from "../../../../main/app/model/device/device"
import SpecsMainInfos from "../../../../main/app/view/widget/computer/sections/MainInfos"
import SnapshotID from "../../../../main/app/model/device/snapshotId"

import '@testing-library/jest-dom'
import { dataManager } from "../../../../main/app/model/AppDataManager";

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
        dataManager.setElement("device",testDevice)

        // Acts
        const { container } = render(<SpecsMainInfos/>)
        const opResult = container.querySelector("#deviceMainInfos")

        // Assert
        expect(opResult).toHaveTextContent("My processor")
        expect(opResult).toHaveTextContent("1")
        expect(opResult).toHaveTextContent("4 GB RAM in total")
        expect(opResult).toHaveTextContent(
            (testDevice.snapshots[0] as SnapshotID).localizedDate()
        )
        expect(opResult).toHaveTextContent(
            "Amount of storage here used in the backup server"
        )
    })
})
