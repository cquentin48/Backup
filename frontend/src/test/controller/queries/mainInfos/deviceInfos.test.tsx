import { type DocumentNode, type FetchResult } from "@apollo/client";
import { type ResultFunction } from "@apollo/client/testing";

import { type DeviceInfosQueryResult, fetchDeviceInfos } from "../../../../main/app/model/queries/computer/deviceInfos";
import Device from "../../../../main/app/model/device/device";
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError";

import FETCH_DEVICE from '../../../../main/res/queries/computer_infos.graphql';
import SnapshotID from "../../../../main/app/model/device/snapshotId";
import gqlClient from "../../../../main/app/model/queries/client";

interface ApolloMockResult {
    request: {
        query: DocumentNode
    }
    result: FetchResult<DeviceInfosQueryResult> | ResultFunction<FetchResult<DeviceInfosQueryResult>, any> | undefined
}

describe("Load device infos GraphQL query unit test", () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    const initMockApolloCalls = (operationStatus: "success" | "failure" | "loading" | "initial", device: Device | undefined = undefined): ApolloMockResult => {
        let deviceResult: FetchResult<DeviceInfosQueryResult> | ResultFunction<FetchResult<DeviceInfosQueryResult>, any> | undefined;

        if (operationStatus === "success") {
            if (device === undefined && operationStatus !== "success") {
                throw new NotFoundError("Invalid operation : if the test type is a success, the device must be defined!")
            }
            deviceResult = {
                data: {
                    deviceInfos: device as Device
                }
            }

        } else if (operationStatus === "failure") {
            const errorMessage = "Raised error message here!"
            deviceResult = {
                errors: [
                    {
                        message: errorMessage
                    }
                ]
            }
        }
        return {
            request: {
                query: FETCH_DEVICE
            },
            result: deviceResult
        }
    }

    test("Successful request", async () => {
        // Given
        const device = new Device("My computer!", "proc", 1, 1, [new SnapshotID("1", "2000-01-01", "My os!")])
        const mockResult = initMockApolloCalls("success", device)
        const dispatch = jest.fn()
        const getState = jest.fn()

        gqlClient.get_query_client().query = jest.fn().mockReturnValue(mockResult.result)

        // Acts
        const result = await fetchDeviceInfos("1")(dispatch, getState, undefined)
        const payloadResult = result.payload as Device

        expect(result.type).toBe("device/deviceInfos/fulfilled")
        expect(payloadResult.cores).toBe(device.cores)
        expect(payloadResult.name).toBe(device.name)
        expect(payloadResult.memory).toBe(device.memory)
        expect(payloadResult.snapshots).toHaveLength(1)
        expect(payloadResult.snapshots[0].key).toBe("1")
        expect(payloadResult.snapshots[0].date.getDate()).toBe(1)
        expect(payloadResult.snapshots[0].date.getMonth()).toBe(0)
        expect(payloadResult.snapshots[0].date.getFullYear()).toBe(2000)
        expect(payloadResult.snapshots[0].operatingSystem).toBe("My os!")
    })

    test("Error request", async () => {
        // Given
        const mockResult = initMockApolloCalls("failure")
        const dispatch = jest.fn()
        const getState = jest.fn()

        gqlClient.get_query_client().query = jest.fn().mockReturnValue(mockResult.result)

        const result = await fetchDeviceInfos("1")(dispatch, getState, undefined)

        expect(result.type).toBe("device/deviceInfos/rejected")
        expect(result.payload).toBe("The device wasn't found!")
    })
})
