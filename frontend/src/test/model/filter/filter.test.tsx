import { filterManager } from "../../../main/app/model/filters/FilterManager"
import Filter from "../../../main/app/model/filters/Filter"
import AlreadyAddedWarning from "../../../main/app/model/exception/warning/alreadyAdded"
import NotFoundError from "../../../main/app/model/exception/errors/notFoundError"
import ValidationError from "../../../main/app/model/exception/errors/validationError"

describe("Filter manager data model unit tests", () => {
    afterEach(() => {
        while (filterManager.getFilters().length > 0) {
            filterManager.removeFilter(0)
        }
    })
    test('Adds new filter (filter not yet added)', () => {
        // Given
        const elementType = "File" as "File" | "Library"
        const fieldName = "name"
        const comparisonType = "<"
        const fieldValue = "3" as unknown as object

        // Acts
        filterManager.addFilter(
            elementType, fieldName, comparisonType, fieldValue
        )
        const opResult = filterManager.getFilter(0)

        if (opResult === null || opResult === undefined) {
            throw new Error("Test failed : no filter added!")
        }

        const expectedResult = new Filter(
            elementType,
            fieldName,
            comparisonType,
            fieldValue,
            filterManager.getFilters().length
        )

        // Assert
        expect(opResult.elementType).toBe(expectedResult.elementType)
        expect(opResult.fieldName).toBe(expectedResult.fieldName)
        expect(opResult.value).toBe(expectedResult.value)
        expect(opResult.opType).toBe(expectedResult.opType)
    })
    test('Adds new filter (filter already added)', () => {
        // Given
        const elementType = "File" as "File" | "Library"
        const fieldName = "name"
        const comparisonType = "<"
        const fieldValue = "3" as unknown as object

        // Acts
        filterManager.addFilter(
            elementType, fieldName, comparisonType, fieldValue
        )

        // Assert
        expect(() => {
            filterManager.addFilter(
                elementType, fieldName, comparisonType, fieldValue
            );
        }).toThrowError(AlreadyAddedWarning)
    })
    test('Removes filter (filter already added)', () => {
        // Given
        const elementType = "File" as "File" | "Library"
        const fieldName = "name"
        const comparisonType = "<"
        const fieldValue = "3" as unknown as object

        filterManager.addFilter(
            elementType, fieldName, comparisonType, fieldValue
        )

        // Acts
        filterManager.removeFilter(0)

        // Assert
        expect(filterManager.getFilters().length).toBe(0)
    })
    test('Removes filter (filter not yet added)', () => {
        // Acts & asserts
        expect(() => { filterManager.removeFilter(0); }).toThrow(NotFoundError)
    })
    test('Gets filter (filter already added)', () => {
        // Given
        const elementType = "File" as "File" | "Library"
        const fieldName = "name"
        const comparisonType = "<"
        const fieldValue = "3" as unknown as object

        filterManager.addFilter(
            elementType, fieldName, comparisonType, fieldValue
        )

        // Acts
        const opResult = filterManager.getFilter(0)

        // Assert
        expect(opResult?.elementType).toBe(elementType)
        expect(opResult?.fieldName).toBe(fieldName)
        expect(opResult?.value).toBe(fieldValue)
        expect(opResult?.opType).toBe(comparisonType)
    })
    test('Removes filter (filter not yet added)', () => {
        // Acts & asserts
        expect(() => filterManager.getFilter(0)).toThrow(NotFoundError)
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
