import React from "react"

import { MockedProvider, type MockedResponse } from '@apollo/client/testing'

import { render, type RenderResult, waitFor } from "@testing-library/react"
import '@testing-library/jest-dom'

import { Provider, useSelector } from "react-redux"
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit"

import gqlClient from "../../../../../../main/app/model/queries/client"
import SoftwareOrigins from "../../../../../../main/app/view/pages/computer/sections/charts/SoftwareOrigins"

import { SnapshotData } from "../../../../../../main/app/model/snapshot/snapshotData"
import filterReducer, { type FilterSliceState } from "../../../../../../main/app/controller/deviceMainInfos/filterSlice";
import snapshotReducer, { type SnapshotSliceState } from "../../../../../../main/app/controller/deviceMainInfos/loadSnapshotSlice"

import FETCH_SNAPSHOT from '../../../../../../main/res/queries/snapshot.graphql';
import { type LoadSnapshotQueryResult } from "../../../../../../main/app/model/queries/computer/loadSnapshot"
import Filter from "../../../../../../main/app/model/filters/Filter"
import { type SnapshotSoftware } from "../../../../../../main/app/model/snapshot/snapshotLibrary"
import NotFoundError from "../../../../../../main/app/model/exception/errors/notFoundError"

/**
 * Preloaded state used for the mocks in the tests
 */
interface MockedPreloadedState {
    /**
     * Snapshot defined in the snapshot slice
     */
    snapshot: SnapshotSliceState

    /**
     * Filters state defined in the filter slice
     */
    filter: FilterSliceState
}

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

describe("Type of softwares origin chart unit test suite", () => {
    afterEach(() => {
        jest.resetAllMocks()
    })

    /**
     * Init the ``useSelector`` mock for the unit test
     * @param {"init" | "success" | "failure" | "loading"} operationStatus Mocked operation status in the test
     * @param {SnapshotData} snapshot Snapshot used for the test
     * @param {Filter[]} filters Filter(s) used for the test
     */
    const initUseSelectorMock = (operationStatus: "init" | "success" | "failure" | "loading", snapshot: SnapshotData | undefined = undefined, filters: Filter[] = []): void => {
        const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
        mockedUseSelector.mockImplementation((selector) =>
            selector(
                {
                    filter: {
                        filters: operationStatus === "success" ? filters : "",
                        error: {
                            message: "",
                            variant: undefined
                        },
                        selectedFilteredIDS: []
                    },
                    snapshot: {
                        snapshotError: operationStatus === "failure" ? "Error raised here!" : "",
                        operationStatus,
                        snapshot: operationStatus === "success" ? snapshot : undefined
                    }
                }
            )
        )
    }

    /**
     * Render the SoftwaresOrigin component with the Apollo query and store mocks
     * @param {"success" | "failure" | "loading" | "initial"} operationStatus Fetch snapshot operation stage
     * @param {SnapshotData | undefined} snapshot Provided snapshot for the success fetch snapshot data
     * @param {EnhancedStore} store Redux mocked store
     * @returns {NotFoundError} If the operation is marked as a success and no snapshot is provided.
     */
    const renderMockedComponent = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined, store: EnhancedStore): RenderResult => {
        let apolloMocks: Array<MockedResponse<LoadSnapshotQueryResult, any>>;
        if (operationStatus === "success") {
            if (snapshot === undefined) {
                throw new NotFoundError("Invalid operation : if the test type is a success, the snapshot must be defined!")
            }
            apolloMocks = [
                {
                    request: {
                        query: FETCH_SNAPSHOT
                    },
                    result: {
                        data: {
                            snapshotInfos: snapshot
                        }
                    }
                }
            ]
        } else if (operationStatus === "failure") {
            apolloMocks = [
                {
                    request: {
                        query: FETCH_SNAPSHOT
                    },
                    result: {
                        errors: [
                            {
                                message: "Failure here for the test!"
                            }
                        ]
                    }
                }
            ]
        } else {
            apolloMocks = [
                {
                    request: {
                        query: FETCH_SNAPSHOT
                    },
                    result: {}
                }
            ]
        }
        return render(
            <Provider store={store}>
                <MockedProvider mocks={apolloMocks} addTypename={false}>
                    <SoftwareOrigins />
                </MockedProvider>
            </Provider>
        )
    }

    /**
     * Initialise the test
     * @param {"success" | "failure" | "loading" | "initial"} testType Type of operation mocked for the unit test
     * @param {SnapshotData | undefined} snapshot Device snapshot used in the unit test
     * @param {Filter[]} filters Filters used in the unit test
     * @returns {EnhancedStore} Mocked store
     * @throws {Error} If the test stage is not in the list
     */
    const initStore = (testType: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined, filters: Filter[] = []): EnhancedStore => {
        let preloadedState: MockedPreloadedState;
        switch (testType) {
            case "success":
                if (snapshot === undefined) {
                    throw new Error("The snapshot must be defined if the loading snapshot data with a GraphQL query is successful!")
                }
                preloadedState = {
                    snapshot: {
                        snapshot,
                        snapshotError: "",
                        operationStatus: "success"
                    },
                    filter: {
                        filterError: {
                            message: "",
                            variant: undefined
                        },
                        filters,
                        selectedFilteredIDS: []
                    }
                }
                break;
            case "failure":
                preloadedState = {
                    snapshot: {
                        snapshot: undefined,
                        snapshotError: "Error raised for the test",
                        operationStatus: "error"
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
                break;
            case "loading":
            case "initial":
                preloadedState = {
                    snapshot: {
                        snapshot: undefined,
                        snapshotError: "",
                        operationStatus: "loading"
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
                break;
            default:
                throw new Error("Invalid test type!")
        }
        return configureStore({
            reducer: {
                snapshot: snapshotReducer,
                filter: filterReducer
            },
            preloadedState
        })
    }

    /**
     * Build the apollo query result for the mock
     * @param {SnapshotSoftware[]} softwares softwares set inside a snapshot
     * @returns {{name:string; installType: string; chosenVersion: string}[]} Apollo query result built for the mock.
     */
    const buildQueryResult = (softwares: SnapshotSoftware[]): Array<{ name: string, installType: string, chosenVersion: string }> => {
        const output: Array<{ name: string, installType: string, chosenVersion: string }> = []
        softwares.forEach((software) => {
            output.push({
                name: software.name,
                installType: software.installType,
                chosenVersion: software.version
            })
        })
        return output
    }

    test("Successful render (no data yet!)", async () => {
        // Given
        initUseSelectorMock("loading")
        const store = initStore("loading", undefined)

        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: [],
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        // Acts
        const { getByText } = renderMockedComponent(
            "loading", undefined, store
        )

        await waitFor(() => {
            expect(getByText("Software origins")).toBeInTheDocument()
        }, { timeout: 500 })
    })

    test("Successful render (single software)", async () => {
        // Given
        const snapshot = new SnapshotData()
        snapshot.addSoftware(
            "test",
            "Test software",
            "test"
        )
        initUseSelectorMock("success", snapshot)

        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: buildQueryResult(snapshot.versions),
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        const store = initStore("success", snapshot)
        renderMockedComponent(
            "success", snapshot, store
        )

        // Acts
        // TODO: replace the render with a method which takes into account the type of operation to simulates it

        await waitFor(() => {
            expect(document.querySelector(".MuiChartsLegend-series-0")).toBeInTheDocument()
        }, { timeout: 500 })
    })

    test("Successful render (Multiple softwares, other included)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 7; i++) {
            snapshot.addSoftware("1.0", `My ${i}-th software`, `${i}th-type`)
        }

        initUseSelectorMock("success", snapshot)
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: buildQueryResult(snapshot.versions),
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        const store = initStore("success", snapshot)

        // Acts
        const { getByText } = renderMockedComponent("success", snapshot, store)

        await waitFor(() => {
            expect(document.querySelector(".MuiChartsLegend-series-0")).toBeInTheDocument()
            expect(getByText("Other")).toBeInTheDocument()
        }, { timeout: 500 })
    })

    test("Successful render (Multiple softwares, same type)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `My ${i}-th software`, `type`)
        }

        initUseSelectorMock("success", snapshot)
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: buildQueryResult(snapshot.versions),
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        const store = initStore("success", snapshot)

        // Acts
        renderMockedComponent("success", snapshot, store)

        // Asserts
        await waitFor(() => {
            expect(document.querySelectorAll(".MuiChartsLegend-series").length).toBe(1)
        }, { timeout: 500 })
    })

    test("Successful render (Multiple softwares, same type, one filter)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `My ${i}-th software`, `type`)
        }

        const filters = [
            new Filter("Library", "name", "==", "My 0-th software" as unknown as object, 0)
        ]

        initUseSelectorMock("success", snapshot, filters)
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: buildQueryResult(snapshot.versions),
                    repositories: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        const store = initStore("success", snapshot, filters)

        // Acts
        renderMockedComponent("success", snapshot, store)

        // Asserts
        await waitFor(() => {
            expect(document.querySelectorAll(".MuiChartsLegend-series").length).toBe(1)
        }, { timeout: 500 })
    })

    test("Failure in render", async () => {
        // Given

        initUseSelectorMock("failure")
        const queryOutput = {
            data: {
                snapshotInfos: {
                    versions: []
                }
            }
        }
        gqlClient.get_query_client().query = jest.fn().mockReturnValue(queryOutput)

        const store = initStore("failure")

        // Acts
        const { getByText } = renderMockedComponent("failure", undefined, store)

        // Asserts
        await waitFor(() => {
            expect(getByText("The softwares origins chart could not be loaded!If the problem occurs frequently, please send an email to you admin!")).toBeInTheDocument()
        }, { timeout: 500 })
    })
})
