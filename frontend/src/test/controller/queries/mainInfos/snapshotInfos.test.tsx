import { DocumentNode, FetchResult } from "@apollo/client";
import { ResultFunction } from "@apollo/client/testing";

import { LoadSnapshotQueryResult, fetchSnapshot } from "../../../../main/app/model/queries/computer/loadSnapshot";
import Device from "../../../../main/app/model/device/device";
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError";

import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';
import SnapshotID from "../../../../main/app/model/device/snapshotId";
import gqlClient from "../../../../main/app/model/queries/client";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";


interface ApolloMockResult {
    request: {
        query: DocumentNode;
    };
    result: FetchResult<LoadSnapshotQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult>, any> | undefined;
}

describe("Load device infos GraphQL query unit test", () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    const initMockApolloCalls = (operationStatus: "success" | "failure" | "loading" | "initial", snapshot: SnapshotData | undefined = undefined): ApolloMockResult => {
        let queryResult: FetchResult<LoadSnapshotQueryResult> | ResultFunction<FetchResult<LoadSnapshotQueryResult>, any> | undefined;

        if (operationStatus === "success") {
            if (snapshot === undefined && operationStatus !== "success") {
                throw new NotFoundError("Invalid operation : if the test type is a success, the snapshot must be defined!")
            }
            queryResult = {
                data: {
                    snapshotInfos: snapshot as SnapshotData
                }
            }

        } else if (operationStatus === "failure") {
            const errorMessage = "Raised error message here!"
            queryResult = {
                errors: [
                    {
                        message: errorMessage
                    }
                ]
            }
        }
        return {
            request: {
                query: FETCH_SNAPSHOT
            },
            result: queryResult
        }
    }

    test("Successful request", async () => {
        // Given
        const snapshot = new SnapshotData("My os!")
        snapshot.addSoftware("test","test software","test version")

        const mockResult = initMockApolloCalls("success", snapshot)
        const dispatch = jest.fn()
        const getState = jest.fn()

        gqlClient.get_query_client().query = jest.fn().mockReturnValue(mockResult.result)

        // Acts
        const result = await fetchSnapshot("1")(dispatch, getState, undefined)
        const payloadResult = result.payload as SnapshotData

        // Asserts
        expect(result.type).toBe("device/snapshotInfos/fulfilled")
        expect(payloadResult.operatingSystem).toBe("My os!")
        expect(payloadResult.versions).toHaveLength(1)
        expect(payloadResult.versions[0].name).toBe("test software")
        expect(payloadResult.versions[0].chosenVersion).toBe("test")
        expect(payloadResult.versions[0].installType).toBe("test version")
        expect(payloadResult.repositories).toHaveLength(0)
    })

    test("Error request", async () => {
        // Given
        const mockResult = initMockApolloCalls("failure")
        const dispatch = jest.fn()
        const getState = jest.fn()

        gqlClient.get_query_client().query = jest.fn().mockReturnValue(mockResult.result)

        const result = await fetchSnapshot("1")(dispatch, getState, undefined)

        expect(result.type).toBe("device/snapshotInfos/rejected")
        expect(result.payload).toBe("The snapshot you try to seek doesn't exist!")
    })
})