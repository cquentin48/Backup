import NotFoundError from "../../../main/app/model/exception/errors/notFoundError"
import NotImplementedError from "../../../main/app/model/exception/errors/notImplementedError"
import ControllerAction from "../../../main/app/view/controller/controllerActions"
import { addFilter } from "../../../main/app/view/controller/deviceMainInfos/addFilter"
import { loadSnapshot } from "../../../main/app/view/controller/deviceMainInfos/loadSnapshot"

describe("Filter addition errors test", () => {
    test("Get observable from the table view without having mouted it first raise NotFoundError", () => {
        // Given
        const observableName = "view"

        // Acts & assert
        expect(() => {
            loadSnapshot.getObservable(observableName)
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

    test("Initiating mother class controller action should trigger NotImplementedError", () => {
        // Acts & assert
        expect(() => {
            new ControllerAction().performAction("My action!")
        }).toThrow(NotImplementedError)
    })
})