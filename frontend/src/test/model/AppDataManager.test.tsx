import { dataManager } from "../../main/app/model/AppDataManager"
import NotFoundError from "../../main/app/model/exception/errors/notFoundError"
import AlreadyAddedWarning from "../../main/app/model/exception/warning/alreadyAdded"

describe("Application data manager unit tests", () => {
    afterEach(() => {
        dataManager.removeAllData()
    })

    test('Adds new element + retrieves it (element not yet added)', () => {
        // Given
        const newElement = "element"
        const elementKey = "myKey"

        // Acts
        dataManager.setElement(elementKey, (newElement as unknown as object))
        const opResult = JSON.parse(dataManager.getElement(elementKey))

        // Asserts
        expect(opResult).toBe(newElement)
    })
    test('Adds new element + retrieves it (element already added)', () => {
        // Given
        const newElement = "element"
        const elementKey = "myKey"

        // Acts
        dataManager.setElement(elementKey, (newElement as unknown as object))

        // Asserts
        expect(
            () => { dataManager.setElement(elementKey, (newElement as unknown as object)); }
        ).toThrow(AlreadyAddedWarning)
    })

    test('Retrieves element (element not yet added)', () => {
        // Given
        const elementKey = "myKey"

        // Acts & Asserts
        expect(() => { dataManager.getElement(elementKey) }).toThrow(NotFoundError)
    })

    test('Removes existing element (element already added)', () => {
        // Given
        const newElement = "element"
        const elementKey = "myKey"
        dataManager.setElement(elementKey, (newElement as unknown as object))
        const objectsCountBeforeOperation = dataManager.size()

        // Acts
        dataManager.removeDataElement(elementKey)
        const newObjectCount = dataManager.size()

        // Asserts
        expect(objectsCountBeforeOperation).toBe(1)
        expect(newObjectCount).toBe(0)
    })
    test('Removes existing element (element not added)', () => {
        // Given
        const elementKey = "myKey"
        const objectsCountBeforeOperation = dataManager.size()

        // Acts & assert
        expect(objectsCountBeforeOperation).toBe(0)
        expect(() => { dataManager.removeDataElement(elementKey) }).toThrow(NotFoundError)
    })

    test('Checking if unknown element is contained', () => {
        // Given
        const elementKey = "myKey"

        // Acts & assert
        expect(dataManager.isdataElementContained(elementKey)).toBe(false)
    })
    test('Removes existing element (element not added)', () => {
        // Given
        const newElement = "element"
        const elementKey = "myKey"
        dataManager.setElement(elementKey, (newElement as unknown as object))

        // Acts
        const containedElement = dataManager.isdataElementContained(elementKey)

        // Assert
        expect(containedElement).toBe(true)
    })
})
