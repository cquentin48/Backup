import React from "react"

import { render } from "@testing-library/react"
import FilesTypes from "../../../../../../main/app/view/pages/computer/sections/charts/FilesTypes"

import '@testing-library/jest-dom'
import { Provider } from "react-redux"
import store from "../../../../../../main/app/controller/store"

describe("Type of files chart unit test suite", () => {
    test("Successful render", async () => {
        // Acts
        const { asFragment } = render(
            <Provider store={store}>
                <FilesTypes />
            </Provider>
        )

        // Acts
        expect(asFragment()).toMatchSnapshot
    })
})
