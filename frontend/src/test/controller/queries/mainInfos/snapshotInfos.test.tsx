import { type DocumentNode, type FetchResult } from "@apollo/client";
import { type ResultFunction } from "@apollo/client/testing";

import { type LoadSnapshotQueryResult, fetchSnapshot } from "../../../../main/app/model/queries/computer/loadSnapshot";
import NotFoundError from "../../../../main/app/model/exception/errors/notFoundError";

import FETCH_SNAPSHOT from '../../../../main/res/queries/snapshot.graphql';
import { executeQuery } from "../../../../main/app/model/queries/client";
import { SnapshotData } from "../../../../main/app/model/snapshot/snapshotData";
import { initApolloMock } from "../../../view/utils/utils";

jest.mock("../../../../main/app/model/queries/client", () => ({
    ...jest.requireActual("../../../../main/app/model/queries/client"),
    executeQuery: jest.fn()
}));

describe("Load device infos GraphQL query unit test", () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    test("Successful request", async () => {
        // Given
        const snapshot = new SnapshotData("My os!")
        snapshot.addSoftware("test", "test software", "test version")

        const mockResult = initApolloMock("success", snapshot);
        (executeQuery as jest.Mock).mockReturnValue(mockResult.get('fetchSnapshot')!.result!["data"]);

        const dispatch = jest.fn();
        const getState = jest.fn();

        // Acts
        const result = await fetchSnapshot("1")(dispatch, getState, undefined)
        const payloadResult = result.payload as SnapshotData

        // Asserts
        expect(result.type).toBe("device/snapshotInfos/fulfilled")
        expect(payloadResult.operatingSystem).toBe("My os!")
        expect(payloadResult.versions).toHaveLength(1)
        expect(payloadResult.versions[0].name).toBe("test software")
        expect(payloadResult.versions[0].version).toBe("test")
        expect(payloadResult.versions[0].installType).toBe("test version")
    })

    test("Error request", async () => {
        // Given
        const mockResult = initApolloMock("snapshotError");
        (executeQuery as jest.Mock).mockReturnValue(
            {
                errors: mockResult.get('fetchSnapshot')!.result!["errors"][0]
            }
        );

        const dispatch = jest.fn();
        const getState = jest.fn();

        const result = await fetchSnapshot("1")(dispatch, getState, undefined)

        expect(result.type).toBe("device/snapshotInfos/rejected")
        expect(result.payload).toBe("The snapshot you try to seek doesn't exist!")
    })
})
