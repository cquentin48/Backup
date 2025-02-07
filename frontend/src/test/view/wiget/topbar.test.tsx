import React from "react";

import { render } from "@testing-library/react"
import TopBar from "../../../main/app/view/widget/topbar"

describe.skip("Topbar unit test suite", () => {
    test.skip("Successfull render", async () => {
        // Acts
        const result = render(
            <TopBar/>
        )

        // Assert
        expect(result.getByText("Top bar here!")).toBeInTheDocument()
    })
})
