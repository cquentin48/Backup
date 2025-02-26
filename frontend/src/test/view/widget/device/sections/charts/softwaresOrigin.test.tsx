import React from "react"

import { MockedProvider, MockedResponse } from '@apollo/client/testing'

import { render, waitFor } from "@testing-library/react"
import '@testing-library/jest-dom'

import { Provider, useSelector } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"

import gqlClient from "../../../../../../main/app/model/queries/client"
import SoftwareOrigins from "../../../../../../main/app/view/pages/computer/sections/charts/SoftwareOrigins"
import store from "../../../../../../main/app/view/controller/store"
import { SnapshotData } from "../../../../../../main/app/model/snapshot/snapshotData"
import filterReducer, { FilterSliceState } from "../../../../../../main/app/view/controller/deviceMainInfos/filterSlice";
import snapshotReducer, { SnapshotSliceState } from "../../../../../../main/app/view/controller/deviceMainInfos/loadSnapshotSlice"

import FETCH_SNAPSHOT from '../../../../../../main/res/queries/snapshot.graphql';
import { LoadSnapshotQueryResult } from "../../../../../../main/app/model/queries/computer/loadSnapshot"


jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))


const successSingleSnapshot = new SnapshotData()
successSingleSnapshot.addSoftware(
    "test",
    "Test software",
    "test"
)

interface MockedPreloadedState {
    snapshot: SnapshotSliceState;
    filter: FilterSliceState;
}

describe("Type of softwares origin chart unit test suite", () => {
    afterEach(() => {
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

    const initStore = (preloadedState: MockedPreloadedState) => {
        return configureStore({
            reducer: {
                snapshot: snapshotReducer,
                filter: filterReducer,
            },
            preloadedState
        })
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
        const snapshot = new SnapshotData()
        snapshot.addSoftware("1.0", "Test software", "Test")
        const store = initStore(
            {
                snapshot: {
                    snapshot: snapshot,
                    snapshotError: "",
                    snapshotLoading: false
                },
                filter: {
                    filterError: {
                        message: "",
                        variant: undefined
                    },
                    filters: [],
                    selectedFilteredIDS: []
                }
            }
        )

        const apolloMocks: MockedResponse<LoadSnapshotQueryResult, any>[] = [ // TODO : replace the any by the interface with query parameters
            {
                request:{
                    query: FETCH_SNAPSHOT
                },
                result: {
                    data: {
                        snapshotInfos: successSingleSnapshot
                    }
                }
            }
        ]

        // Acts
        // TODO: replace the render with a method which takes into account the type of operation to simulates it
        render(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SoftwareOrigins />
                </MockedProvider>
            </Provider>
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
