import React from "react"

import { MockedProvider } from "@apollo/client/testing"

import userEvent from "@testing-library/user-event"

import '@testing-library/jest-dom'
import { fireEvent, act, waitFor } from "@testing-library/react"

import { SnackbarProvider, useSnackbar } from "notistack"
import { Provider } from "react-redux"

import Device from "../../../../../main/app/model/device/device"
import Filter from "../../../../../main/app/model/filters/Filter"
import { SnapshotData } from "../../../../../main/app/model/snapshot/snapshotData"

import FilterTable from "../../../../../main/app/view/pages/computer/sections/filters/table"

import { renderWithProviders, initApolloMock, initInitialState, initEnqueueSnackbarMock, renderMockedComponent } from "../../../utils/utils"

describe("Device main infos Filter table render", () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("Pending data render", async () => {
        // Before
        initApolloMock("loadingDevice")
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("loadingSnapshot")
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("loadingSnapshot")

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render", async () => {
        // Before
        const device = new Device();
        const snapshot = new SnapshotData();

        initApolloMock("success")
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);

        const apolloMocks = initApolloMock("success", snapshot, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Unsuccessful render", async () => {
        // Before
        initEnqueueSnackbarMock()

        // Given
        const initialState = initInitialState("snapshotError")
        const store = renderWithProviders(initialState)

        // Acts
        const apolloMocks = initApolloMock("snapshotError")
        const { asFragment } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Row selected : footer displayed", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter("File", "name", "<", 3 as any as object, 1)
        ]
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, getByText, rerender } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const rowFileCell = container.querySelector(".MuiDataGrid-row")

        if (rowFileCell === null) {
            throw new Error("No row : test fail!")
        }

        fireEvent.click(rowFileCell)

        rerender(
            <Provider store={store}>
                <MockedProvider mocks={Array.from(apolloMocks.values())}>
                    <SnackbarProvider>
                        <FilterTable />
                    </SnackbarProvider>
                </MockedProvider>
            </Provider>
        )

        // Asserts
        await waitFor(() => {
            expect(getByText("Delete filters")).toBeInTheDocument()
        }, { timeout: 2500 })
    })

    test("New filter button should render form successfully", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const newFilterForm = container.querySelector('.newElementDialog') as HTMLDivElement
        expect(newFilterForm).toBeInTheDocument()
    })

    test("When the user changes the type of filter, the input type should be updated", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2000-01-01'))

        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []

        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)

        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, getByText } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const selectedElement = getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const fieldNameSelect = (
            (newFilterDialogRootNode as HTMLElement).children[1] as HTMLSelectElement
        ).querySelector("select") as HTMLSelectElement
        expect(fieldNameSelect).toBeInTheDocument()
        userEvent.selectOptions(fieldNameSelect, "creationDate")

        const fieldInput = (container.querySelector('[id="datePicker"]')!.children[0].children[1]) as HTMLSelectElement

        // Asserts
        expect(fieldInput).toBeInTheDocument()
        expect(fieldInput.getAttribute("value")).toBe("2000-01-01")
    })

    test("Trying to add new filter without setting value should trigger a notification display",
        async () => {
            // Given
            const snapshot = new SnapshotData()
            const filters: Filter[] = []
            snapshot.addSoftware("test", "test software", "1.0")

            const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
            const store = renderWithProviders(initialState)

            initEnqueueSnackbarMock()

            const apolloMocks = initApolloMock("success", snapshot)
            const { container, getByText } = renderMockedComponent(store, apolloMocks, <FilterTable />);

            // Acts
            const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
            fireEvent.click(newFilterButton)

            const selectedElement = getByText("File")
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
            const newFilterForm = container.querySelector(".newElementDialog")
            expect(newFilterForm).toBeInTheDocument()
            expect(useSnackbar).toHaveBeenCalled()
        })

    test("Pressing tab key should focus other element", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, getByText } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const selectedElement = getByText("File")
        let newFilterDialogRootNode = selectedElement?.parentElement
        while (newFilterDialogRootNode !== null && newFilterDialogRootNode.className !== "newElementDialog") {
            newFilterDialogRootNode = newFilterDialogRootNode.parentElement
        }

        const inputs = {
            fieldValueInput: newFilterDialogRootNode?.childNodes.item(3) as HTMLElement,
            elementTypeSelect: newFilterDialogRootNode?.childNodes.item(0) as HTMLElement,
            fieldNameSelect: newFilterDialogRootNode?.childNodes.item(1) as HTMLElement,
            comparisonSelect: newFilterDialogRootNode?.childNodes.item(2) as HTMLElement,
        }

        Object.keys(inputs).map((key: string) => {
            inputs[key] = inputs[key].querySelector('input, select')
        })

        // Asserts
        Object.keys(inputs).forEach((fieldName: string, index: number) => {
            const currentProperty = inputs[fieldName];
            const otherProperties = Object.keys(inputs).filter((property) => property !== fieldName)

            expect(currentProperty).toHaveFocus();
            otherProperties.forEach((property) => expect(inputs[property]).not.toHaveFocus());

            fireEvent.keyDown(inputs.fieldValueInput, {
                key: "Tab",
                code: "Tab"
            })
        })
    })

    test("Adding element (no filter yet added!) and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, getByText } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[id="deviceMainInfosFilterValueField"]') as HTMLInputElement
        const newElementDialog = container.querySelector(".newElementDialog")

        userEvent.type(fieldValueInput, "Test value")

        const selectedElement = getByText("File")
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
        expect(newElementDialog).not.toBeInTheDocument()
        expect(getByText("Test value")).toBeInTheDocument()
    })

    test("Entering value and emptying it should display toast notification (empty value)", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('[id="deviceMainInfosFilterValueField"]') as HTMLInputElement

        userEvent.type(fieldValueInput, "t")

        expect(fieldValueInput).toHaveValue("t")

        userEvent.clear(fieldValueInput)

        const helperText = container.querySelector("#deviceMainInfosFilterValueField")

        // Asserts
        expect(fieldValueInput).toBeInTheDocument()
        expect(helperText).toBeInTheDocument()
    })

    test("Adding two identical filter and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter(
                "File",
                "name",
                "<",
                "New filter !" as unknown as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
        userEvent.click(newFilterButton)

        const fieldValueInput = container.querySelector('#deviceMainInfosFilterValueField') as HTMLInputElement;

        fireEvent.change(fieldValueInput, { target: { value: "New filter !" } });

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        });

        // Asserts
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("The filter is already set! It will be ignored!", { variant: "warning" })
    })

    test("Adding two filters with same ID", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter(
                "File",
                "name",
                "<",
                "Test value!" as unknown as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const mockEnqueueSnackbar = initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, getByText } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
        fireEvent.click(newFilterButton)

        const fieldValueInput = (getByText("Field value").parentElement as HTMLElement).querySelector("input") as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: "Test value2!" } })

        fireEvent.keyDown(fieldValueInput, {
            key: "Enter",
            code: "Enter"
        })

        // Asserts
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Another filter has this id!", { variant: "warning" })
        expect(fieldValueInput).toBeInTheDocument()
    })

    test("Adding two filters and pressing enter key", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = [
            new Filter(
                "File",
                "name",
                "<",
                "New filter 0!" as unknown as object,
                0
            ), new Filter(
                "File",
                "name",
                "<",
                "New filter 1!" as unknown as object,
                1
            ),
        ]
        snapshot.addSoftware("test", "test software", "1.0")

        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), [])
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", snapshot)

        initEnqueueSnackbarMock()

        const { container, rerender } = renderMockedComponent(store, apolloMocks, <FilterTable />);


        // Acts
        filters.forEach((filter) => {
            const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement
            fireEvent.click(newFilterButton)

            const fieldValueInput = container.querySelector("#deviceMainInfosFilterValueField") as HTMLInputElement;
            fireEvent.change(fieldValueInput, { target: { value: filter.value } });

            fireEvent.keyDown(fieldValueInput, {
                key: "Enter",
                code: "Enter"
            });

            rerender(
                <Provider store={store}>
                    <MockedProvider mocks={Array.from(apolloMocks.values())}>
                        <SnackbarProvider>
                            <FilterTable />
                        </SnackbarProvider>
                    </MockedProvider>
                </Provider>
            );
        })

        // Asserts
        const rows = Array.from(container.querySelector("tbody")!.children);
        expect(rows.length).toBe(filters.length)

        for (let i = 0; i < filters.length; i++) {
            const currentFilter = filters[i];
            const rowElements = Array.from(rows[i].children)

            const foundFieldName = rowElements[1].innerHTML
            const foundType = rowElements[2].innerHTML
            const foundData = rowElements[3].innerHTML

            expect(foundFieldName).toBe(currentFilter.id.toString())
            expect(foundType).toBe(currentFilter.elementType)
            expect(foundData).toBe(currentFilter.fieldName)
        }
    })

    test("Selecting two added filters", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters = [
            new Filter(
                "File",
                "name",
                "<",
                "test0" as any as object,
                0
            ),
            new Filter(
                "File",
                "name",
                "<",
                "test1" as any as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, rerender } = renderMockedComponent(store, apolloMocks, <FilterTable />);


        // Acts
        let fieldValueInput;
        Array.from(container.querySelectorAll('.MuiDataGrid-row')).forEach((row) => {
            fireEvent.click(row);
        });

        // Asserts
        const footer = container.querySelector('#GridFooterContent');
        const footerSelectedElements = footer!.children[0].innerHTML;
        const expectedText = `${filters.length} filtres sélectionnés!`;
        expect(footerSelectedElements).toBe(expectedText)
    })

    test("Delete one filter from two previously added", async () => {
        // Given
        const snapshot = new SnapshotData()
        const filters = [
            new Filter(
                "File",
                "name",
                "<",
                "test0" as any as object,
                0
            ),
            new Filter(
                "File",
                "name",
                "<",
                "test1" as any as object,
                1
            )
        ]
        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        initEnqueueSnackbarMock()

        const apolloMocks = initApolloMock("success", snapshot)
        const { container, getByText } = renderMockedComponent(store, apolloMocks, <FilterTable />);

        // Acts
        const displayedFiltersCount = Array.from(container.querySelectorAll('.MuiDataGrid-row')).length;
        const rowCheckbox = (Array.from(container.querySelectorAll('.MuiDataGrid-row')))[0].querySelector("input") as HTMLInputElement
        fireEvent.click(rowCheckbox)

        const filterDeleteButton = getByText("Delete filters")
        fireEvent.click(filterDeleteButton)

        // Asserts
        expect(displayedFiltersCount).toBe(filters.length)
        expect(Array.from(container.querySelectorAll('.MuiDataGrid-row'))).toHaveLength(filters.length - 1)
        expect(container.querySelector('#GridFooterNoContent')).toBeInTheDocument()
    })

    test("Selecting date in the input field name from the new filter Form", async () => {
        // Before
        jest.useFakeTimers().setSystemTime(new Date('2020-01-13'));

        // Given
        const snapshot = new SnapshotData()
        const filters: Filter[] = []
        snapshot.addSoftware("test", "test software", "1.0")
        const initialState = initInitialState("success", ["snapshot", "device", "filter"], snapshot, new Device(), filters)
        const store = renderWithProviders(initialState)

        const apolloMocks = initApolloMock("success", snapshot)
        const { container } = renderMockedComponent(store, apolloMocks, <FilterTable />);


        // Acts
        const newFilterButton = container.querySelector('.newFilterButton') as HTMLButtonElement

        fireEvent.click(newFilterButton)
        const fieldNameInput = container.querySelector('#fieldName') as HTMLSelectElement

        fireEvent.change(fieldNameInput, { target: { value: "creationDate" } })
        const fieldValueInput = container.querySelector("#datePicker")!.querySelector('input') as HTMLInputElement

        fireEvent.change(fieldValueInput, { target: { value: '2020-01-11' } });

        const updatedDate = fieldValueInput.value;

        // Asserts
        expect(updatedDate).toBe("2020-01-11")
    })
})