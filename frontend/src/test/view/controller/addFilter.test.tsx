import NotFoundError from "../../../main/app/model/exception/errors/notFoundError"
import { addFilter } from "../../../main/app/view/controller/deviceMainInfos/addFilter"

describe("Filter addition errors test", () => {
    test("Get observable from the table view without having mouted it first raise NotFoundError", () => {
        // Given
        const observableName = "view"

        // Acts & assert
        expect(() => {
            addFilter.getObservable(observableName)
        }).toThrow(NotFoundError)

    })

    test("Remove observable from the table view without having mouted it first raise NotFoundError", () => {
        // Given
        const observableName = "view"

        // Acts & assert
        expect(() => {
            addFilter.removeObservable(observableName)
        }).toThrow(NotFoundError)

    })
})