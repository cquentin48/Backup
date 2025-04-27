import Filter from "../../../main/app/model/filters/Filter"
import NotFoundError from "../../../main/app/model/exception/errors/notFoundError"
import ValidationError from "../../../main/app/model/exception/errors/validationError"

describe("Filter manager data model unit tests", () => {

    test('Adds new filter (filter not yet added)', () => {
        // Given
        const elementType = "File" as "File" | "Library"
        const fieldName = "name"
        const comparisonType = "<"
        const fieldValue = "3" as unknown as object

        // Acts
        const opResult = new Filter(
            elementType,
            fieldName,
            comparisonType,
            fieldValue,
            1
        )

        // Assert
        expect(opResult.elementType).toBe(elementType)
        expect(opResult.fieldName).toBe(fieldName)
        expect(opResult.value).toBe(fieldValue)
        expect(opResult.opType).toBe(comparisonType)
    })

    test('Input type filter (no error should be raised here)', () => {
        // Acts & asserts
        expect(() => { Filter.inputTypeAuthorizedList("File"); }).not.toThrow(ValidationError)
    })
    test('Input type filter (invalid type, ``ValidationError`` should be raised)', () => {
        // Acts & asserts
        expect(() => { Filter.inputTypeAuthorizedList("My type!"); }).toThrow(ValidationError)
    })

    test('Comparison type filter (no error should be raised here)', () => {
        // Acts & asserts
        expect(() => { Filter.comparisonTypesCheck("<"); }).not.toThrow(ValidationError)
    })
    test('Comparison type filter (invalid type, ``ValidationError`` should be raised)', () => {
        // Acts & asserts
        expect(() => { Filter.comparisonTypesCheck("comp type!"); }).toThrow(ValidationError)
    })

    test('Gets filter input field name list(no error should be raised here)', () => {
        // Given
        const inputTypes = [
            {
                label: "File",
                expectedOutput: ['name', 'creationDate', 'lastUpdateDate', 'size', 'path', 'type']
            },
            {
                label: "Library",
                expectedOutput: ['name', 'firstUploadDate', 'lastUploadDate', 'size', 'repository', 'version']
            },
            {
                label: 'default',
                expectedOutput: ['Please choose a type']
            }
        ]
        // Acts & asserts
        inputTypes.forEach((inputType) => {
            const label = inputType.label as "File" | "Library" | ""
            const opResult = Filter.inputFieldName(label)
            expect(opResult).toStrictEqual(inputType.expectedOutput)
        })
    })
    test('Gets field name type (everything is ok)', () => {
        // Given
        const inputType = "File"
        const inputName = "name"

        // Acts
        const opResult = Filter.getFieldNameType(inputType, inputName)
        const expectedResult = "text"

        // Asserts
        expect(opResult).toStrictEqual(expectedResult)
    })
    test('Gets field name type (invalid input type)', () => {
        // Given
        const inputType = "Type"
        const inputName = "name"

        // Acts & assert
        expect(() => Filter.getFieldNameType(inputType, inputName)).toThrow(NotFoundError)
    })
    test('Gets field name type (invalid field name type)', () => {
        // Given
        const inputType = "File"
        const inputName = "My type"

        // Acts & assert
        expect(() => Filter.getFieldNameType(inputType, inputName)).toThrow(TypeError)
    })
})
