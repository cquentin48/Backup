import filterReducer, { FilterSliceState, deleteFilter } from "../../../main/app/controller/deviceMainInfos/filterSlice"
import Filter from "../../../main/app/model/filters/Filter"

describe("Filter slice test suite", ()=>{
    test("Delete filter successfully (one filter added, all deleted)", ()=>{
        // Given
        const filter = new Filter("File", "name", "<", "3" as any as object, 0)
        const initialState: FilterSliceState = {
            filters: [filter],
            selectedFilteredIDS: [],
            filterError: {
                message: "",
                variant: undefined
            }
        }

        // Acts
        const slice = filterReducer(initialState, deleteFilter([0]))

        // Asserts
        expect(slice.filters).toHaveLength(0)
    })

    test("Delete filter successfully (two filters added, all deleted)", ()=>{
        // Given
        const filters = [
            new Filter("File", "name", "<", "3" as any as object, 0),
            new Filter("File", "name", "<", "6" as any as object, 1),
        ]
        const initialState: FilterSliceState = {
            filters: filters,
            selectedFilteredIDS: [],
            filterError: {
                message: "",
                variant: undefined
            }
        }

        // Acts
        const slice = filterReducer(initialState, deleteFilter([0,1]))

        // Asserts
        expect(slice.filters).toHaveLength(0)
    })

    test("Failed to delete filter (one filter added, id for deletion not related to filter)", ()=>{
        // Given
        const filters = [
            new Filter("File", "name", "<", "3" as any as object, 0),
        ]
        const initialState: FilterSliceState = {
            filters: filters,
            selectedFilteredIDS: [],
            filterError: {
                message: "",
                variant: undefined
            }
        }

        // Acts
        const slice = filterReducer(initialState, deleteFilter([1]))

        // Asserts
        expect(slice.filters).toHaveLength(1)
        expect(slice.filterError.message).toBe("The index 1 set is not in the array !")
        expect(slice.filterError.variant).toBe("error")
    })

    test("Failed to delete filter (two filters added, same id)", ()=>{
        // Given
        const filters = [
            new Filter("File", "name", "<", "3" as any as object, 0),
            new Filter("File", "name", "<", "6" as any as object, 0),
        ]
        const initialState: FilterSliceState = {
            filters: filters,
            selectedFilteredIDS: [],
            filterError: {
                message: "",
                variant: undefined
            }
        }

        // Acts
        const slice = filterReducer(initialState, deleteFilter([0]))

        // Asserts
        expect(slice.filters).toHaveLength(2)
        expect(slice.filterError.message).toBe("The index 0 set has found multiple filters in the array!")
        expect(slice.filterError.variant).toBe("error")
    })
})