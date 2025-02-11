import React from "react";

import { render } from "@testing-library/react"
import TopBar from "../../../main/app/view/widget/topbar"

import '@testing-library/jest-dom'

describe("Topbar unit test suite", () => {
    test("Successful render", async () => {
        // Acts
        const result = render(
            <TopBar/>
        )

        // Assert
        expect(result.getByText("Top bar here!")).toBeInTheDocument()
    })
})
