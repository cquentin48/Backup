import React from "react";

import { fireEvent, render } from "@testing-library/react"

import '@testing-library/jest-dom'

import ComputeSideNavBar from "../../../../../main/app/view/widget/computer/navBar/computerSideNavBar"
import { BrowserRouter } from "react-router-dom"

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
        textElements.forEach(async (textElement, index)=>{
            const navBarElement = document.querySelector(`#sideNavBarElement${index}`)
            if(!navBarElement){
                throw new Error(`Unit test error : nav bar element #${index} not found!`)
            }
            await fireEvent.mouseOver(navBarElement)
            expect(container).toHaveTextContent(textElement)
        })
    })

    test("Detect update element click event", async () => {
        // Given
        const updateSelectedId: (newID: number) => void = (newID: number) => {
            console.log(newID)
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
        textElements.forEach(async (textElement, index)=>{
            const navBarElement = document.querySelector(`#sideNavBarElement${index}`)
            if(!navBarElement){
                throw new Error(`Unit test error : nav bar element #${index} not found!`)
            }
            await fireEvent.click(navBarElement)
            expect(console.log).toHaveBeenCalled()
        })
    })
})
