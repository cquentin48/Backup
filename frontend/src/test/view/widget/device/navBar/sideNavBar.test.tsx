import React from "react";
import { BrowserRouter, LinkProps } from "react-router-dom"

import { fireEvent, render } from "@testing-library/react"

import '@testing-library/jest-dom'

import ComputeSideNavBar from "../../../../../main/app/view/pages/computer/navBar/computerSideNavBar";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    Link: (props: LinkProps) => <span>{props.children}</span>
}))

describe("Device main infos side nav bar unit test suite", () => {
    test("Check rendering", async () => {
        // Given
        const updateSelectedId: (newID: number) => void = (newID: number) => {
            newID = newID + 1
        }

        // Acts
        const { container } = render(
            <BrowserRouter>
                <ComputeSideNavBar
                    selectedID={0}
                    updateSelectedID={updateSelectedId}
                />
            </BrowserRouter>)

        const navBarElements = container.querySelectorAll(".sidebarNavElement")

        // Asserts
        navBarElements.forEach((domElement) => {
            expect(domElement).toBeInTheDocument()
        })
    })

    test("Detect hover on element", async () => {
        // Given
        const updateSelectedId: (newID: number) => void = (newID: number) => {
            newID = newID + 1
        }

        // Acts
        const { container } = render(
            <BrowserRouter>
                <ComputeSideNavBar
                    selectedID={0}
                    updateSelectedID={updateSelectedId}
                />
            </BrowserRouter>)

        const textElements = [
            "Main informations",
            "Libraries",
            "Software configurations",
            "Folder storage"
        ]

        // Asserts
        textElements.forEach((textElement, index) => {
            const navBarElement = document.querySelector(`#sideNavBarElement${index}`)
            if (navBarElement == null) {
                throw new Error(`Unit test error : nav bar element #${index} not found!`)
            }
            fireEvent.mouseOver(navBarElement)
            expect(container).toHaveTextContent(textElement)
        })
    })

    test("Detect update element click event", () => {
        // Given
        let mockState = 0;
        const setStateMock = jest.fn((newState) => (mockState = newState));

        jest.spyOn(React, "useState").mockImplementation(() => [mockState, setStateMock]);

        // Acts
        render(
            <BrowserRouter>
                <ComputeSideNavBar
                    selectedID={0}
                    updateSelectedID={setStateMock}
                />
            </BrowserRouter>
        )

        const textElements = [
            "Main informations",
            "Libraries",
            "Software configurations",
            "Folder storage"
        ]

        // Asserts
        textElements.forEach((textElement, index) => {
            const navBarElement = document.querySelector(`#sideNavBarElement${index}`)
            console.log(navBarElement?.querySelector("a"))
            if (navBarElement == null) {
                throw new Error(`Unit test error : nav bar element #${index} not found!`)
            }
            fireEvent.mouseOver(navBarElement)
            fireEvent.click(navBarElement)
            expect(setStateMock).toBeCalled()
        })
    })
})
