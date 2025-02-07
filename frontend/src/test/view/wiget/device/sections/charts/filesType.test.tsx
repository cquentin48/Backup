import { render } from "@testing-library/react"
import FilesTypes from "../../../../../../main/app/view/widget/computer/sections/charts/FilesTypes"

describe("Type of files chart unit test suite", () => {
    test.skip("Successfull render", async () => {
        // Acts
        const {container} = render(
            <FilesTypes/>
        )

        // Acts
        expect(container).toBeInTheDocument()
    })
})