import Repository from "../../../main/app/model/snapshot/repository"

describe("Repository model class unit test suite", () => {
    test("Correct initialisation", () => {
        // Given
        const sourceLines = "lines"
        const name = "name"

        // Act
        const opResult = new Repository(sourceLines, name)

        // Assert
        expect(opResult.name).toBe(name)
        expect(opResult.sourceLines).toBe(sourceLines)
    })
})
