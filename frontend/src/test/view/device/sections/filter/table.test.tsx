import React from "react"

import FilterTable from "../../../../../main/app/view/pages/computer/sections/filters/table"

import { addFilter as addMainInfosFilter } from "../../../../../main/app/view/controller/deviceMainInfos/addFilter"
import { filterManager } from "../../../../../main/app/view/model/filters/FilterManager"
import Device from "../../../../../main/app/model/device/device"
import { enqueueSnackbar, SnackbarProvider, useSnackbar } from "notistack"
import { fireEvent, render, waitFor, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event"
import { removeDeviceMainInfosFilter as removeMainInfosFilter } from "../../../../../main/app/view/controller/deviceMainInfos/removeFilters"

jest.mock("notistack", () => {
    const actual = jest.requireActual("notistack");
    return {
        ...actual,
        useSnackbar: jest.fn(),
    };
});

describe("Device main infos Filter table render (no filter)", () => {
    beforeEach(() => {
        addMainInfosFilter.addObservable("softwareInfosPieChart", jest.fn())
        removeMainInfosFilter.addObservable("softwareInfosPieChart", jest.fn())
    })
    afterEach(() => {
        const filtersCount = filterManager.getFilters().length
        for (let index = filtersCount - 1; index >= 0; index--) {
            filterManager.removeFilter(index)
        }
        addMainInfosFilter.removeObservable("softwareInfosPieChart")
        removeMainInfosFilter.removeObservable("softwareInfosPieChart")
        jest.resetAllMocks()
    })

    test.skip("Initial render", () => {
        // Acts
        const { container } = render(
            <FilterTable device={new Device()} />
        )

        // Asserts
        const footer = container.querySelector("#GridFooterNoContent")
        expect(footer).toBeInTheDocument()
    })

    test.skip("Row selected : footer displayed", async () => {
        // Given
        const inputType = "File"
        const fieldName = "name"
        const comparison = "<"
        const value = "3"

        const { rerender } = render(
            <FilterTable device={new Device()} />
        )
        addMainInfosFilter.addObservable("softwareInfosPieChart", jest.fn())
        addMainInfosFilter.performAction(
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
            <FilterTable device={new Device()} />
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

    test.skip("New filter button should render form successfully", async () => {
        // Given

        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable device={new Device()} />
        )

        // Asserts
        const selectedElement = screen.getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }
        expect(newFilterDialogRootNode).toBeInTheDocument()
    })

    test.skip("When the user changes the type of filter, the input type should be updated", async () => {
        // Given
        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable device={new Device()} />
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

    test.skip("Trying to add new filter without setting value should launch console.log (button click)", async () => {
        // Given
        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <SnackbarProvider>
                <FilterTable device={new Device()} />
            </SnackbarProvider>
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

    test.skip("Trying to add new filter without setting value should launch console.log", async () => {
        // Given
        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        addMainInfosFilter.addObservable("mainDeviceInfosFilterTable", jest.fn())
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <SnackbarProvider>
                <FilterTable device={new Device()} />
            </SnackbarProvider>
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

    test.skip("Pressing tab key should focus other element", async () => {
        // Given

        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable device={new Device()} />
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

    test.skip("Adding element (no filter yet added!) and pressing enter key", async () => {
        // Given
        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable device={new Device()} />
        )

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
        await waitFor(() => {
            expect(screen.getByText("Test value")).toBeInTheDocument()
        }, { timeout: 2500 })
        expect(fieldValueInput).not.toBeInTheDocument()
    })

    test.skip("Entering value and emptying it should display helper text", async () => {
        // Given
        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable device={new Device()} />
        )

        const fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value" } })
        fireEvent.change(fieldValueInput, { target: { value: "" } })

        // Asserts
        expect(fieldValueInput).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText("You must enter a value here!")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test("Adding two identical filter and pressing enter key", async () => {
        // Given
        render(
            <SnackbarProvider>
                <FilterTable device={new Device()} />
            </SnackbarProvider>
        )

        // Acts
        let fieldValueInput;
        for (let i = 0; i <= 1; i++) {
            const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
            await userEvent.click(newFilterButton)
            fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

            fireEvent.change(fieldValueInput, { target: { value: "Test value" } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
        }

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
        const rows = ((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).children[1].children[1].children[1].children[0].querySelector(".MuiDataGrid-row")
        await waitFor(() => {
            expect(rows).toBeInTheDocument()
        }, { timeout: 2500 })
        expect(fieldValueInput).toBeInTheDocument()
        //expect(enqueueSnackbar).toBeCalled()

    })

    test.skip("Adding two filters and pressing enter key", async () => {
        // Given
        render(
            <SnackbarProvider>
                <FilterTable device={new Device()} />
            </SnackbarProvider>
        )

        // Acts
        let fieldValueInput;
        for (let i = 0; i <= 1; i++) {
            const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
            fireEvent.click(newFilterButton)
            fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

            fireEvent.change(fieldValueInput, { target: { value: `Test value${i}` } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
        }

        // Asserts
        const rows = ((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).querySelector(".MuiDataGrid-row")
        expect(filterManager.getFilters().length).toBe(2)
        await waitFor(() => {
            expect(rows).toBeInTheDocument()
        }, { timeout: 2500 })
        expect(console.warn).toBeCalled()
    })

    test.skip("Selecting two added filters", async () => {
        // Given
        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        let fieldValueInput;
        for (let i = 0; i <= 1; i++) {
            const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
            fireEvent.click(newFilterButton)
            rerender(
                <FilterTable device={new Device()} />
            )
            fieldValueInput = (screen.getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

            fireEvent.change(fieldValueInput, { target: { value: `Test value${i}` } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
        }

        const checkbox = (((screen.getByText("Columns").parentNode as ParentNode).parentNode as ParentNode).parentNode as ParentNode).querySelector(".MuiDataGrid-columnHeaderCheckbox")?.querySelector("input") as HTMLInputElement
        fireEvent.click(checkbox)

        // Asserts
        await waitFor(() => {
            expect((screen.getByText("2 filtres sélectionnés!").parentNode as ParentNode).querySelector("p")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test.skip("Delete one filter from three previously added", async () => {
        // Given
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar,
        });
        const { getByText } = render(
            <SnackbarProvider>
                <FilterTable device={new Device()} />
            </SnackbarProvider>
        )
        addMainInfosFilter.addObservable("softwareInfosPieChart", jest.fn())
        removeMainInfosFilter.addObservable("softwareInfosPieChart", jest.fn())

        // Acts
        const newFilterButton = getByText("New filter") as HTMLInputElement
        for (let i = 0; i <= 2; i++) {
            await userEvent.click(newFilterButton)
            let fieldValueInput = (getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement
            fireEvent.change(fieldValueInput, { target: { value: `Test value${i}` } })

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            })
        }

        for (let i = 0; i <= 1; i++) {
            const rowCheckbox = (screen.getByText(`Test value${i}`).parentNode as ParentNode).querySelector("input") as HTMLInputElement
            fireEvent.click(rowCheckbox)
        }
        const filterDeleteButton = screen.getByText("Delete filters")
        fireEvent.click(filterDeleteButton)

        // Asserts
        expect(filterManager.getFilters().length).toBe(1)
    }, 5000)

    test.skip("Selecting date in the input field name from the new filter Form", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2020-01-13'))

        // Given
        jest.mock("@mui/material/Select", () => (...rest: any) => {
            <div>
                <input data-testid='mocked-select' {...rest} />
            </div>
        })
        render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        const fieldNameInput = (screen.getAllByText("Field name")[0].parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValue = screen.getByText("Field value").parentElement as HTMLElement
        const inputField = fieldValue.querySelector("input") as HTMLInputElement
        const fieldValueType = fieldValue.querySelector("button") as HTMLInputElement

        fireEvent.click(fieldValueType)
        const selectedDate = screen.getByText("11")
        fireEvent.click(selectedDate)
        const updatedDate = inputField.value

        // Asserts
        expect(inputField.getAttribute("placeholder")).toBe("MM/DD/YYYY")
        await waitFor(() => {
            expect(selectedDate).not.toBeInTheDocument()
        })
        expect(updatedDate).toBe("01/11/2020")
    })

    test.skip("Typing date directly in the input field name from the new filter Form", async () => {
        jest.useFakeTimers().setSystemTime(new Date('2020-01-13'))
        // Given
        jest.mock("@mui/material/Select", () => (...rest: any) => {
            <div>
                <input data-testid='mocked-select' {...rest} />
            </div>
        })
        const { rerender } = render(
            <FilterTable device={new Device()} />
        )

        // Acts
        const newFilterButton = screen.getByRole('button', { name: /New filter/i }) as Element
        fireEvent.click(newFilterButton)
        rerender(
            <FilterTable device={new Device()} />
        )
        const fieldNameInput = (screen.getAllByText("Field name")[0].parentElement as HTMLElement).querySelector("input") as HTMLInputElement
        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValue = screen.getByText("Field value").parentElement as HTMLElement

        const inputField = fieldValue.querySelector("input") as HTMLInputElement
        userEvent.type(inputField, "01/10/2020")
        const newDate = inputField.value
        const fieldValueType = fieldValue.querySelector("button") as HTMLInputElement
        fireEvent.click(fieldValueType)

        // Asserts
        expect(inputField.getAttribute("placeholder")).toBe("MM/DD/YYYY")
        expect(newDate).toBe("01/10/2020")
    })
})
