import React from "react"

import { render, waitFor } from "@testing-library/react"

import '@testing-library/jest-dom'

import gqlClient from "../../../../../../main/app/model/queries/client"
import SoftwareOrigins from "../../../../../../main/app/view/widget/computer/sections/charts/SoftwareOrigins"
import { loadSnapshot } from "../../../../../../main/app/view/controller/deviceMainInfos/loadSnapshot"
import { dataManager } from "../../../../../../main/app/model/AppDataManager"

describe("Type of softwares origin chart unit test suite", () => {
    afterEach(() => {
        dataManager.removeAllData()
        jest.resetAllMocks()
    })

    test("Successful render (single software)", async () => {
        // Given
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: [
                        {
                            name: "My software",
                            softwareInstallType: "type",
                            softwareVersion: "1.0"
                        }
                    ],
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        // Acts
        const { rerender } = render(
            <SoftwareOrigins />
        )
        loadSnapshot.performAction("1")
        rerender(
            <SoftwareOrigins />
        )

        await waitFor(() => {
            expect(document.querySelector(".MuiChartsLegend-series-0")).toBeInTheDocument()
        }, { timeout: 10000 })
    }, 10500)

    test("Successful render (Multiple softwares, other included)", async () => {
        // Given
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: [
                        {
                            name: "My software",
                            softwareInstallType: "type",
                            softwareVersion: "1.0"
                        },
                        {
                            name: "My second software",
                            softwareInstallType: "type2",
                            softwareVersion: "1.0"
                        },
                        {
                            name: "My third software",
                            softwareInstallType: "type3",
                            softwareVersion: "1.0"
                        },
                        {
                            name: "My fourth software",
                            softwareInstallType: "type4",
                            softwareVersion: "1.0"
                        },
                        {
                            name: "My fifth software",
                            softwareInstallType: "type5",
                            softwareVersion: "1.0"
                        },
                        {
                            name: "My sixth software",
                            softwareInstallType: "type6",
                            softwareVersion: "1.0"
                        },
                        {
                            name: "My seventh software",
                            softwareInstallType: "type7",
                            softwareVersion: "1.0"
                        }
                    ],
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        // Acts
        const { getByText } = render(
            <SoftwareOrigins />
        )
        loadSnapshot.performAction("1")

        await waitFor(() => {
            expect(document.querySelector(".MuiChartsLegend-series-0")).toBeInTheDocument()
            expect(getByText("Other")).toBeInTheDocument()
        }, { timeout: 2000 })
    })

    test("Successful render (Multiple softwares, same type)", async () => {
        // Given
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: [
                        {
                            name: "My software",
                            softwareInstallType: "type",
                            softwareVersion: "1.0"
                        },
                        {
                            name: "My second software",
                            softwareInstallType: "type",
                            softwareVersion: "1.0"
                        }
                    ],
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        // Acts
        render(
            <SoftwareOrigins />
        )
        loadSnapshot.performAction("1")

        await waitFor(() => {
            expect(document.querySelectorAll(".MuiChartsLegend-series").length).toBe(1)
        }, { timeout: 2000 })
    })

    test("Error in render (Multiple softwares, same type)", async () => {
        // Given
        gqlClient.get_query_client().query = jest.fn().mockImplementation(() => {
            throw new Error("Error in implementation!")
        })

        // Acts
        render(
            <SoftwareOrigins />
        )
        loadSnapshot.performAction("1")

        expect((console.error as any).mock.calls).toBe(1)
    })
})
