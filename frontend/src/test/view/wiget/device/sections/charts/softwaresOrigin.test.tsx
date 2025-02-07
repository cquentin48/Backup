import { render } from "@testing-library/react"
import SoftwareOrigins from "../../../../../../main/app/view/widget/computer/sections/charts/SoftwareOrigins"
import { loadSnapshot } from "../../../../../../main/app/view/controller/deviceMainInfos/loadSnapshot"

describe("Type of softwares origin chart unit test suite", () => {
    test.skip("Successfull render", async () => {
        // Given
        // Acts
        const {container} = render(
            <SoftwareOrigins/>
        )

        // Acts
        expect(container).toBeInTheDocument()
    })
})