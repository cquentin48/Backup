import { fetchDeviceInfos } from "../../../../main/app/model/queries/computer/deviceInfos";
import Device from "../../../../main/app/model/device/device";

import SnapshotID from "../../../../main/app/model/device/snapshotId";
import { executeQuery } from "../../../../main/app/model/queries/client";
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
        const device = new Device("My computer!", "proc", 1, 1, [new SnapshotID("1", "2000-01-01", "My os!")])
        const mockResult = initApolloMock("success", undefined, device);
        (executeQuery as jest.Mock).mockReturnValue(mockResult.get('fetchDevice')!.result!["data"]);
    
        const dispatch = jest.fn();
        const getState = jest.fn();


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
        const mockResult = initApolloMock("deviceError", undefined, undefined)
        const dispatch = jest.fn();
        const getState = jest.fn();

        (executeQuery as jest.Mock).mockReturnValue(
            {
                errors: mockResult.get('fetchDevice')!.result!["errors"][0]
            }
        )

        const result = await fetchDeviceInfos("1")(dispatch, getState, undefined)

        expect(result.type).toBe("device/deviceInfos/rejected")
        expect(result.payload).toBe("The device wasn't found!")
    })
})
