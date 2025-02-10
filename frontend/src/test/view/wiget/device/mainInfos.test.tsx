import React from "react"

import { render } from "@testing-library/react"
import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshot"
import MainInfosFrame from "../../../../main/app/view/widget/computer/mainInfos"

describe("MainInfosFrame unit test suite", () => {
    test.skip("Successfull render", async () => {
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
        render(
            <MainInfosFrame
                computer={testDevice}
            />
        )
    })
})
