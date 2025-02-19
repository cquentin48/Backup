import React from "react"

import '@testing-library/jest-dom'

import { fireEvent, render } from "@testing-library/react"
import Device from "../../../../main/app/model/device/device"
import SnapshotID from "../../../../main/app/model/device/snapshotId"
import MainInfosFrame from "../../../../main/app/view/pages/computer/mainInfosFrame"
import { dataManager } from "../../../../main/app/model/AppDataManager"

import snapshotDataQuery from "../../../../main/res/queries/snapshot.graphql"
import deviceDataQuery from "../../../../main/res/queries/computer_infos.graphql"
import gqlClient from "../../../../main/app/model/queries/client"

describe("MainInfosFrame unit test suite", () => {
    beforeEach(() => {
        gqlClient.get_query_client().query = initGraphQLMock()
    })

    /**
     * Init graphql query mock for the unit tests
     * @returns {jest.Mock} Mocked graphql query function
     */
    const initGraphQLMock = (): jest.Mock =>{
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

    afterEach(() => {
        dataManager.removeAllData()
    })

    test("Successful render", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [
                new SnapshotID(
                    "1",
                    "2020-01-01",
                    "My OS!"
                )
            ]
        )
        dataManager.setElement("device", testDevice)

        // Acts
        render(
            <MainInfosFrame device={testDevice} />
        )
    })

    test("Update selected item", async () => {
        // Given
        const testDevice = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [
                new SnapshotID(
                    "1",
                    "2020-01-01",
                    "My OS!"
                ),
                new SnapshotID(
                    "2",
                    "2020-01-02",
                    "My OS!"
                )
            ]
        )
        dataManager.setElement("device", testDevice)

        // Acts
        const { container, getByText } = render(
            <MainInfosFrame device={testDevice} />
        )

        const snapshotSelect = container.querySelector(".MuiSelect-nativeInput") as Element
        fireEvent.change(snapshotSelect, { target: { value: testDevice.snapshots[1].id } })

        // Asserts
        expect(getByText(testDevice.snapshots[1].localizedDate())).toBeInTheDocument()
    })
})
