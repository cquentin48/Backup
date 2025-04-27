import React from "react";

import { render } from "@testing-library/react"
import TopBar from "../../../main/app/view/pages/computer/topbar";

import '@testing-library/jest-dom'

describe("Topbar unit test suite", () => {
    test("Successful render", async () => {
        // Acts
        const { asFragment } = render(
            <TopBar />
        )

        // Assert
        expect(asFragment()).toMatchSnapshot()
    })
})
