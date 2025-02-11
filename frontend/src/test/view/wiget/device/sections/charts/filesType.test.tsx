import React from "react"

import { render } from "@testing-library/react"
import FilesTypes from "../../../../../../main/app/view/widget/computer/sections/charts/FilesTypes"

import '@testing-library/jest-dom'

describe("Type of files chart unit test suite", () => {
    test("Successful render", async () => {
        // Acts
        const { container } = render(
            <FilesTypes/>
        )

        // Acts
        expect(container).toBeInTheDocument()
    })
})
