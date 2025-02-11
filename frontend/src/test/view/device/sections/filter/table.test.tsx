import React from "react"

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import FilterTable from "../../../../../main/app/view/widget/computer/sections/filters/table"

import '@testing-library/jest-dom'
import { addFilter } from "../../../../../main/app/view/controller/deviceMainInfos/addFilter"
import FiltersSection from "../../../../../main/app/view/widget/computer/sections/filters/section"
import { filterManager } from "../../../../../main/app/view/model/filters/FilterManager"

describe("Device main infos Filter table render (no filter)", () => {
    afterEach(()=>{
        const filtersCount = filterManager.getFilters().length
        for(let index = filtersCount-1 ; index >= 0; index--){
            filterManager.removeFilter(index)
        }
    })

    test("Section render", () => {
        // Acts
        render(
            <FiltersSection/>
        )
    })

    test("Initial render", () => {
        // Acts
        const { container } = render(
            <FilterTable/>
        )

        // Asserts
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
            <FilterTable/>
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
            <FilterTable/>
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
            <FilterTable/>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable/>
        )

        // Asserts
        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }
        expect(newFilterDialogRootNode).toBeInTheDocument()
    })

    test("When the user changes the type of filter, the input type should be updated", async () => {
        // Given
        const { rerender } = render(
            <FilterTable/>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable/>
        )

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const inputTypeSelect = (newFilterDialogRootNode as HTMLElement).childNodes.item(0).childNodes.item(1).childNodes.item(1)

        fireEvent.change(inputTypeSelect, { target: { value: "Library" } })
        const fieldNameSelect = (newFilterDialogRootNode as HTMLElement).childNodes.item(1).childNodes.item(1).childNodes.item(1)
        fireEvent.change(fieldNameSelect, { target: { value: "firstUploadDate" } })

        // Asserts
        expect(screen.getByText("firstUploadDate")).toBeInTheDocument()
    })

    test("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given

        const { rerender } = render(
            <FilterTable/>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable/>
        )

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const addFilterButton = newFilterDialogRootNode?.childNodes.item(4)
        fireEvent.click(addFilterButton as ChildNode)

        // Asserts
        expect(console.error).toBeCalled()
    })

    test("Trying to add new filter without setting value should launch console.log", async () => {
        // Given

        const { rerender } = render(
            <FilterTable/>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable/>
        )

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const addFilterButton = newFilterDialogRootNode?.childNodes.item(4)

        fireEvent.keyDown(addFilterButton as ChildNode, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(console.error).toBeCalled()
    })

    test("Pressing tab key should focus other element", async () => {
        // Given

        const { rerender } = render(
            <FilterTable/>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable/>
        )

        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const fieldValueInput = newFilterDialogRootNode?.childNodes.item(3).childNodes.item(1).childNodes.item(0) as HTMLElement

        fireEvent.keyDown(fieldValueInput, {
            key: "Tab",
            code: "Tab"
        })

        // Asserts
        expect(fieldValueInput).toHaveFocus()
    })

    test("Adding element (no filter yet added!) and pressing enter key", async () => {
        // Given

        const { rerender } = render(
            <FilterTable/>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable/>
        )

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, {target: {value: "Test value"}})

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
        await waitFor(()=>{
            expect(screen.getByText("Test value")).toBeInTheDocument()
        },{timeout: 2500})
        expect(fieldValueInput).not.toBeInTheDocument()
    })

    test("Adding element (same filter already added) and pressing enter key", async () => {
        // Given
        filterManager.addFilter(
            "File",
            "name",
            "<",
            "Test value" as any as object
        )
        const { rerender } = render(
            <FilterTable/>
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable/>
        )

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, {target: {value: "Test value"}})

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
        expect(console.warn).toBeCalled()
    })
})
