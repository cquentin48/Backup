import React from "react";

import { render } from "@testing-library/react"
import Device from "../../../../main/app/model/device/device"
import SpecsMainInfos from "../../../../main/app/view/widget/computer/sections/MainInfos"
import SnapshotID from "../../../../main/app/model/device/snapshot"

import '@testing-library/jest-dom'

describe("Device main infos test suite", () => {
    test("Successful render with custom data", async () => {
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
        const { container } = render(<SpecsMainInfos computer={testDevice} />)
        const opResult = container.querySelector("#deviceMainInfos")

        // Assert
        expect(opResult).toHaveTextContent("My processor")
        expect(opResult).toHaveTextContent("1")
        expect(opResult).toHaveTextContent("4 GB RAM in total")
        expect(opResult).toHaveTextContent(
            (testDevice.snapshots[0] ?? new SnapshotID("", "0000-00-00")).localizedDate()
        )
        expect(opResult).toHaveTextContent(
            "Amount of storage here used in the backup server"
        )
    })
})
