import React from "react"

import '@testing-library/jest-dom'

import { fireEvent, render } from "@testing-library/react"
import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshot"
import MainInfosFrame from "../../../../main/app/view/widget/computer/mainInfos"
import { dataManager } from "../../../../main/app/model/AppDataManager"

describe("MainInfosFrame unit test suite", () => {
    afterEach(() => {
        dataManager.removeAllData()
    })

    test("Successful render", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            "My OS",
            [
                new SnapshotID(
                    "1",
                    "2020-01-01"
                )
            ]
        )

        // Acts
        render(
            <MainInfosFrame
                computer={testDevice}
            />
        )
    })

    test("Update selected item", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            "My OS",
            [
                new SnapshotID(
                    "1",
                    "2020-01-01"
                ),
                new SnapshotID(
                    "2",
                    "2020-01-02"
                )
            ]
        )

        // Acts
        const { container, getByText } = render(
            <MainInfosFrame
                computer={testDevice}
            />
        )

        const snapshotSelect = container.querySelector(".MuiSelect-nativeInput") as Element
        fireEvent.change(snapshotSelect, { target: { value: testDevice.snapshots[1].id } })

        // Asserts
        expect(getByText(testDevice.snapshots[1].localizedDate())).toBeInTheDocument()
    })
})
