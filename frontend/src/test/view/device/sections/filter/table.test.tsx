import { fireEvent, render, screen } from "@testing-library/react"
import FilterTable from "../../../../../main/app/view/widget/computer/sections/filters/table"

import '@testing-library/jest-dom'
import { addFilter } from "../../../../../main/app/view/controller/deviceMainInfos/addFilter"
import FiltersSection from "../../../../../main/app/view/widget/computer/sections/filters/section"

describe("Device main infos Filter table render (no filter)", () => {
    test("Section render", ()=>{
        // Acts
        render(
            <FiltersSection
                filters={[]}
                removeFilters={()=>{}}
            />
        )
    })

    test("Initial render", () => {
        // Acts
        const { container } = render(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        //Asserts
        const footer = container.querySelector("#GridFooterNoContent")
        expect(footer).toBeInTheDocument()
    })

    test("Row selected : footer displayed", async () => {
        // Given
        const inputType = "File"
        const fieldName = "name"
        const comparison = "<"
        const value = "3"

        const { rerender } = render(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )
        addFilter.performAction(
            JSON.stringify(
                [
                    inputType,
                    fieldName,
                    comparison,
                    value
                ]
            )
        )
        rerender(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        // Acts
        const rowFileCell = screen.getByText("File")
        if (rowFileCell === null) {
            throw new Error("No row : test fail!")
        }
        const row = rowFileCell.parentNode
        if (row === null) {
            throw new Error("No row : test fail!")
        }
        fireEvent.click(row)

        // Asserts
        expect(await screen.findByText("Delete filters")).toBeInTheDocument()
    })

    test("New filter button should render form successfully", async () => {
        // Given

        const { rerender } = render(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        // Acts
        const newFilterButton = await screen.getByRole('button', {name:/New filter/i})
        if(newFilterButton === null){
            throw new Error("Test fail : no new filter button found!")
        }
        await fireEvent.click(newFilterButton)
        rerender(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        // Asserts
        const selectedElement = screen.getByText("File")
        var newFilterDialogRootNode = selectedElement?.parentElement
        while(newFilterDialogRootNode!== null && newFilterDialogRootNode.className !== "newElementDialog"){
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }
        expect(newFilterDialogRootNode).toBeInTheDocument()
    })

    test("When the user changes the type of filter, the input type should be updated", async () => {
        // Given
        const { rerender } = render(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        // Acts
        const newFilterButton = await screen.getByRole('button', {name:/New filter/i})
        if(newFilterButton === null){
            throw new Error("Test fail : no new filter button found!")
        }
        await fireEvent.click(newFilterButton)
        rerender(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        const selectedElement = screen.getByText("File")
        var newFilterDialogRootNode = selectedElement?.parentElement
        while(newFilterDialogRootNode!== null && newFilterDialogRootNode.className !== "newElementDialog"){
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const inputTypeSelect = newFilterDialogRootNode?.childNodes.item(0)!.childNodes.item(1)!.childNodes.item(1)!

        fireEvent.change(inputTypeSelect, {target:{value:"Library"}})
        const fieldNameSelect = newFilterDialogRootNode?.childNodes.item(1)!.childNodes.item(1)!.childNodes.item(1)!
        fireEvent.change(fieldNameSelect, {target:{value:"firstUploadDate"}})

        // Asserts
        expect(screen.getByText("firstUploadDate")).toBeInTheDocument()
    })

    test("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given

        const { rerender } = render(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        // Acts
        const newFilterButton = await screen.getByRole('button', {name:/New filter/i})
        if(newFilterButton === null){
            throw new Error("Test fail : no new filter button found!")
        }
        await fireEvent.click(newFilterButton)
        rerender(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        const selectedElement = screen.getByText("File")
        var newFilterDialogRootNode = selectedElement?.parentElement
        while(newFilterDialogRootNode!== null && newFilterDialogRootNode.className !== "newElementDialog"){
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const addFilterButton = newFilterDialogRootNode?.childNodes.item(4)!

        fireEvent.click(addFilterButton)

        // Asserts
        expect(console.log).toBeCalled()
    })

    test("Trying to add new filter without setting value should launch console.log (enter key pressed)", async () => {
        // Given

        const { rerender } = render(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        // Acts
        const newFilterButton = await screen.getByRole('button', {name:/New filter/i})
        if(newFilterButton === null){
            throw new Error("Test fail : no new filter button found!")
        }
        await fireEvent.click(newFilterButton)
        rerender(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        const selectedElement = screen.getByText("File")
        var newFilterDialogRootNode = selectedElement?.parentElement
        while(newFilterDialogRootNode!== null && newFilterDialogRootNode.className !== "newElementDialog"){
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const addFilterButton = newFilterDialogRootNode?.childNodes.item(4)!
        
        fireEvent.keyDown(addFilterButton, {
            key:"Enter",
            code:"Enter",
        })

        // Asserts
        expect(console.log).toBeCalled()
    })

    test("Pressing tab key should focus other element", async () => {
        // Given

        const { rerender } = render(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        // Acts
        const newFilterButton = await screen.getByRole('button', {name:/New filter/i})
        if(newFilterButton === null){
            throw new Error("Test fail : no new filter button found!")
        }
        await fireEvent.click(newFilterButton)
        rerender(
            <FilterTable
                filters={[]}
                removeSelectedIndexes={(number) => { number }}
            />
        )

        const selectedElement = screen.getByText("File")
        var newFilterDialogRootNode = selectedElement?.parentElement
        while(newFilterDialogRootNode!== null && newFilterDialogRootNode.className !== "newElementDialog"){
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const fieldValueInput = newFilterDialogRootNode?.childNodes.item(3).childNodes.item(1).childNodes.item(0)!
        

        fireEvent.keyDown(fieldValueInput, {
            key:"Tab",
            code:"Tab",
        })

        // Asserts
        expect(fieldValueInput).toHaveFocus()
    })
})