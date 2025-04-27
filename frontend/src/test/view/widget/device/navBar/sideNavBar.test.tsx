import React from "react";
import { BrowserRouter, type LinkProps } from "react-router-dom"

import { fireEvent, render } from "@testing-library/react"

import '@testing-library/jest-dom'

import ComputeSideNavBar from "../../../../../main/app/view/pages/computer/navBar/computerSideNavBar";

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
    test("Check render", async () => {
        // Given
        const updateSelectedId: (jest.Mock) = jest.fn()

        // Acts
        const { asFragment } = render(
            <BrowserRouter>
                <ComputeSideNavBar
                    selectedID={0}
                    updateSelectedID={updateSelectedId}
                />
            </BrowserRouter>)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Detect hover on element", async () => {
        // Given
        const updateSelectedId: (jest.Mock) = jest.fn()

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
            const navBarElement = document.querySelector(`#sideNavBarElement${index}`) as HTMLElement
            fireEvent.mouseOver(navBarElement)
            expect(container).toHaveTextContent(textElement)
        })
    })

    test("Detect update element click event", () => {
        // Given
        const updateSelectedId: (jest.Mock) = jest.fn()

        // Acts
        const { rerender } = render(
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
        textElements.forEach((_, index) => {
            const navBarElement = document.querySelector(`#sideNavBarElement${index}`) as HTMLElement
            fireEvent.click(navBarElement)

            rerender(
                <BrowserRouter>
                    <ComputeSideNavBar
                        selectedID={index}
                        updateSelectedID={updateSelectedId}
                    />
                </BrowserRouter>
            )

            expect(updateSelectedId).toBeCalledTimes(index + 1)
            expect(updateSelectedId).toBeCalledWith(index)
            expect(navBarElement).toHaveClass("selected")
        })
    })
})
