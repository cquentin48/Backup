import React from "react"

import { render, waitFor } from "@testing-library/react"

import '@testing-library/jest-dom'

import gqlClient from "../../../../../../main/app/model/queries/client"
import SoftwareOrigins from "../../../../../../main/app/view/pages/computer/sections/charts/SoftwareOrigins"
import { dataManager } from "../../../../../../main/app/model/AppDataManager"
import { Provider, useSelector } from "react-redux"
import store from "../../../../../../main/app/view/controller/store"
import { SnapshotData } from "../../../../../../main/app/model/snapshot/snapshotData"

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

describe("Type of softwares origin chart unit test suite", () => {
    afterEach(() => {
        dataManager.removeAllData()
        jest.resetAllMocks()
    })

    /**
     * Init the ``useSelector`` mock for the unit test
     */
    const initUseSelectorMock = (): void => {
        const snapshot = new SnapshotData()
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        snapshot.addSoftware("1.0", "My software", "test")
        mockedUseSelector.mockImplementation((selector) =>
            selector(
                {
                    filter: {
                        filters: [],
                        error: {
                            message: "",
                            variant: undefined
                        },
                        selectedFilteredIDS: []
                    },
                    snapshot: {
                        snapshotError: "",
                        snapshotLoading: false,
                        snapshot
                    }
                }
            )
        )
    }

    test.skip("Successful render (no data yet!)", async () => {
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
        const { getByText } = render(
            <Provider store={store}>
                <SoftwareOrigins />
            </Provider>
        )

        await waitFor(() => {
            expect(getByText("Software origins")).toBeInTheDocument()
        }, { timeout: 500 })
    })

    test("Successful render (single software)", async () => {
        // Given
        initUseSelectorMock()

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

    test.skip("Successful render (Multiple softwares, other included)", async () => {
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
            <Provider store={store}>
                <SoftwareOrigins />
            </Provider>
        )

        await waitFor(() => {
            expect(document.querySelector(".MuiChartsLegend-series-0")).toBeInTheDocument()
            expect(getByText("Other")).toBeInTheDocument()
        }, { timeout: 500 })
    })

    test.skip("Successful render (Multiple softwares, same type)", async () => {
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
            <Provider store={store}>
                <SoftwareOrigins />
            </Provider>
        )

        await waitFor(() => {
            expect(document.querySelectorAll(".MuiChartsLegend-series").length).toBe(1)
        }, { timeout: 500 })
    })
})
