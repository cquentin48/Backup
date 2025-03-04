import React from "react"
import { dataManager } from "../../../../main/app/model/AppDataManager"
import gqlClient from "../../../../main/app/model/queries/client"
import { render, waitFor } from "@testing-library/react"
import ComputerPage from "../../../../main/app/view/pages/computer/computerPage"

import snapshotDataQuery from "../../../../main/res/queries/snapshot.graphql"
import deviceDataQuery from "../../../../main/res/queries/computer_infos.graphql"

import '@testing-library/jest-dom'
import { BrowserRouter } from "react-router-dom"
import { ApolloError } from "@apollo/client"
import { useSnackbar } from "notistack"

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ id: '1' }))
}));

jest.mock("notistack", () => ({
    ...jest.requireActual("notistack"),
    useSnackbar: jest.fn()
}));

describe.skip("Device page", () => {
    afterEach(() => {
        dataManager.removeAllData()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    /**
     * Init jest mock for the method ``enqueueSnackbar`` from the library ``notistack``
     * @returns {jest.Mock} mocked method
     */
    const initEnqueueSnackbarHook = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });
        return mockEnqueueSnackbar
    }

    /**
     * Mock the graphql client ``query`` method for the unit tests
     * @returns {jest.Mock} Mocked graphql query method
     */
    const mockGraphQLQueryMethod = (): jest.Mock => {
        const deviceQueryOutput = {
            data: {
                deviceInfos: {
                    cores: 4,
                    memory: 16,
                    name: "My PC!",
                    operatingSystem: "OS",
                    processor: "My processor name",
                    snapshots: [
                        {
                            snapshotId: "1",
                            snapshotDate: "2020-01-01"
                        }
                    ]
                }
            }
        }
        const snapshotQueryOutput = {
            data: {
                snapshotInfos: {
                    versions: [
                        {
                            name: "My software",
                            chosenVersion: "type",
                            installType: "1.0"
                        }
                    ],
                    repositories: []
                }
            }
        }
        return jest.fn().mockImplementation(async ({ query }) => {
            if (query === snapshotDataQuery) {
                return await Promise.resolve(
                    snapshotQueryOutput
                )
            } else if (query === deviceDataQuery) {
                return await Promise.resolve(
                    deviceQueryOutput
                )
            }
        })
    }

    test("Initial render (before data loaded)", async () => {
        // Before
        initEnqueueSnackbarHook()
        gqlClient.get_query_client().query = mockGraphQLQueryMethod()

        // Acts
        const { asFragment } = render(<ComputerPage />)

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Initial render (after loaded data)", async () => {
        // Before
        initEnqueueSnackbarHook()
        gqlClient.get_query_client().query = mockGraphQLQueryMethod()

        // Acts
        const { asFragment } = render(
            <BrowserRouter>
                <ComputerPage />
            </BrowserRouter>
        )

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Initial render (data error)", async () => {

        // Before
        const enqueueMock = initEnqueueSnackbarHook()
        const graphqlMockQueryOutput = jest.fn().mockImplementation(({ query }) => {
            throw new ApolloError({ errorMessage: "Invalid data!" })
        })
        gqlClient.get_query_client().query = graphqlMockQueryOutput

        // Acts
        const { asFragment } = render(
            <BrowserRouter>
                <ComputerPage />
            </BrowserRouter>
        )

        // Asserts
        expect(asFragment()).toMatchSnapshot()
        expect(enqueueMock).toBeCalled()
    })
})
