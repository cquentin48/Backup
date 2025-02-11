import React from "react"
import { dataManager } from "../../../../main/app/model/AppDataManager"
import gqlClient from "../../../../main/app/model/queries/client"
import { render, waitFor } from "@testing-library/react"
import ComputerPage from "../../../../main/app/view/pages/computer/computerPage"

import snapshotDataQuery from "../../../../main/res/queries/snapshot.graphql"
import deviceDataQuery from "../../../../main/res/queries/computer_infos.graphql"

import '@testing-library/jest-dom'
import { BrowserRouter } from "react-router-dom"

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
const graphqlMockQueryOutput = jest.fn().mockImplementation(({ query }) => {
    if (query === snapshotDataQuery) {
        return Promise.resolve(
            snapshotQueryOutput
        )
    } else if (query === deviceDataQuery) {
        return Promise.resolve(
            deviceQueryOutput
        )
    }
})

describe("Device page", () => {
    afterEach(() => {
        dataManager.removeAllData()
        gqlClient.get_query_client().query = oldQueryMethod
    })
    beforeEach(() => {
        gqlClient.get_query_client().query = graphqlMockQueryOutput
    })

    test("Initial render (before data loaded)", () => {
        // Given
        render(<ComputerPage />)
    })

    test("Initial render (after loaded data)", async () => {
        const { container } = render(
            <BrowserRouter>
                <ComputerPage />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(container.querySelector("#ComputerMainInfosPage")).toBeInTheDocument()
        }, { timeout: 2500 })
    }, 3000)
})