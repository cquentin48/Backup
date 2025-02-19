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

const oldQueryMethod = gqlClient.get_query_client().query

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ id: '1' }))
}));

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
                    softwareInstallType: "type",
                    softwareVersion: "1.0"
                }
            ],
            repositories: []
        }
    }
}
const graphqlMockQueryOutput = jest.fn().mockImplementation(async ({ query }) => {
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

describe("Device page", () => {
    afterEach(() => {
        dataManager.removeAllData()
        gqlClient.get_query_client().query = oldQueryMethod
    })

    test("Initial render (before data loaded)", () => {
        // Given
        gqlClient.get_query_client().query = graphqlMockQueryOutput

        // Acts
        const { container } = render(<ComputerPage />)

        // Asserts
        expect(container).toBeInTheDocument()
    })

    test("Initial render (after loaded data)", async () => {
        // Given
        gqlClient.get_query_client().query = graphqlMockQueryOutput

        // Acts
        const { container } = render(
            <BrowserRouter>
                <ComputerPage />
            </BrowserRouter>
        )

        // Asserts
        await waitFor(() => {
            expect(container.querySelector("#DeviceMainInfosPage")).toBeInTheDocument()
        }, { timeout: 2500 })
    }, 3000)

    test.skip("Initial render (data error)", async () => {
        // Given
        const graphqlMockQueryOutput = jest.fn().mockImplementation(({ query }) => {
            throw new ApolloError({ errorMessage: "Invalid data!" })
        })
        gqlClient.get_query_client().query = graphqlMockQueryOutput

        // Acts
        render(
            <BrowserRouter>
                <ComputerPage />
            </BrowserRouter>
        )

        // Asserts
        expect(console.error).toBeCalled()
    }, 3000)
})
