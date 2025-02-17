import React from "react"

import { render } from "@testing-library/react"
import FilesTypes from "../../../../../../main/app/view/widget/computer/sections/charts/FilesTypes"

import '@testing-library/jest-dom'
import Device from "../../../../../../main/app/model/device/device"

describe("Type of files chart unit test suite", () => {
    test("Successful render", async () => {
        // Acts
        const { container } = render(
            <FilesTypes device={new Device()}/>
        )

        // Acts
        expect(container).toBeInTheDocument()
    })
})
