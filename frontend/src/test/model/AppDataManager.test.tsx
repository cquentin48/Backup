import { dataManager } from "../../main/app/model/AppDataManager"
import AlreadyAddedWarning from "../../main/app/model/exception/warning/alreadyAdded"

describe("Application data manager unit tests", () => {
    afterEach(()=>{
        dataManager.removeAllData()
    })
    test('Adds new element + retrieves it (element not yet added)', () => {
        // Given
        const newElement = "element"
        const elementKey = "myKey"

        // Acts
        dataManager.addElement(elementKey, (newElement as unknown as object))
        const opResult = JSON.parse(dataManager.getElement(elementKey) as string)

        // Asserts
        expect(opResult).toBe(newElement)
    })
    test('Adds new element + retrieves it (element already added)', () => {
        // Given
        const newElement = "element"
        const elementKey = "myKey"

        // Acts
        dataManager.addElement(elementKey, (newElement as unknown as object))

        // Asserts
        expect(
            ()=>dataManager.addElement(elementKey, (newElement as unknown as object))
        ).toThrow(AlreadyAddedWarning)
    })
})