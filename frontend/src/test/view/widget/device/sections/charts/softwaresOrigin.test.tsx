import React from "react"

import { render, waitFor } from "@testing-library/react"

import '@testing-library/jest-dom'

import gqlClient from "../../../../../../main/app/model/queries/client"
import SoftwareOrigins from "../../../../../../main/app/view/pages/computer/sections/charts/SoftwareOrigins"
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
                            installType: "type",
                            chosenVersion: "1.0"
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

        await waitFor(() => {
            expect(document.querySelector(".MuiChartsLegend-series-0")).toBeInTheDocument()
        }, { timeout: 500 })
    })

    test("Successful render (Multiple softwares, other included)", async () => {
        // Given
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: [
                        {
                            name: "My software",
                            installType: "type",
                            chosenVersion: "1.0"
                        },
                        {
                            name: "My second software",
                            installType: "type2",
                            chosenVersion: "1.0"
                        },
                        {
                            name: "My third software",
                            installType: "type3",
                            chosenVersion: "1.0"
                        },
                        {
                            name: "My fourth software",
                            installType: "type4",
                            chosenVersion: "1.0"
                        },
                        {
                            name: "My fifth software",
                            installType: "type5",
                            chosenVersion: "1.0"
                        },
                        {
                            name: "My sixth software",
                            installType: "type6",
                            chosenVersion: "1.0"
                        },
                        {
                            name: "My seventh software",
                            installType: "type7",
                            chosenVersion: "1.0"
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

        await waitFor(() => {
            expect(document.querySelector(".MuiChartsLegend-series-0")).toBeInTheDocument()
            expect(getByText("Other")).toBeInTheDocument()
        }, { timeout: 500 })
    })

    test("Successful render (Multiple softwares, same type)", async () => {
        // Given
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: [
                        {
                            name: "My software",
                            installType: "type",
                            chosenVersion: "1.0"
                        },
                        {
                            name: "My second software",
                            installType: "type",
                            chosenVersion: "1.0"
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

        await waitFor(() => {
            expect(document.querySelectorAll(".MuiChartsLegend-series").length).toBe(1)
        }, { timeout: 500 })
    })
})
