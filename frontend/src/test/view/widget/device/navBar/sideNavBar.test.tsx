import React from "react";
import { BrowserRouter, LinkProps, MemoryRouter } from "react-router-dom"

import { fireEvent, render, screen } from "@testing-library/react"

import '@testing-library/jest-dom'

import ComputeSideNavBar from "../../../../../main/app/view/pages/computer/navBar/computerSideNavBar";
import SideNavBarElement from "../../../../../main/app/view/pages/computer/navBar/sideNavBarElement";

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom")

    return {
        ...actual,
        Link: ({ to, children, ...props }: LinkProps) =>
            <a href={typeof to === "string" ? to : "#"} {...props}>
                {children}
            </a>,
        useLocation: () => ({
            pathname: '#'
        }),
        useNavigate: () => jest.fn()
    }
})

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
        const updateMock = jest.fn()
        const { getByText, rerender } = render(
            <MemoryRouter>
                <SideNavBarElement
                    componentPath="/"
                    navBarLabel="Main informations"
                    classId="mainInformations"
                    image={
                        <div></div>
                    }
                    id={1}
                    updateSelectedNumber={updateMock}
                    selectedElement={0}
                />
            </MemoryRouter>
        )

        const textElement = "Main informations"
        var navBarObject = ((getByText(textElement) as Element).parentElement as ParentNode).parentElement as HTMLElement

        // Acts
        fireEvent.mouseOver(navBarObject)
        const classesBeforeSelectItem: string[] = []
        navBarObject.classList.forEach((divClass)=>
            classesBeforeSelectItem.push(divClass)
        )

        fireEvent.click(navBarObject)
        
        rerender(
            <MemoryRouter>
                <SideNavBarElement
                    componentPath="/"
                    navBarLabel="Main informations"
                    classId="mainInformations"
                    image={
                        <div></div>
                    }
                    id={1}
                    updateSelectedNumber={updateMock}
                    selectedElement={1}
                />
            </MemoryRouter>
        )
        navBarObject = ((screen.getByText(textElement) as Element).parentElement as ParentNode).parentElement as HTMLElement

        // Asserts
        expect(classesBeforeSelectItem).not.toContain('selected')
        expect(classesBeforeSelectItem).toContain('sidebarNavElement')
        expect(updateMock).toHaveBeenCalledTimes(1)
        expect(navBarObject).toHaveClass('selected')

    })
})
