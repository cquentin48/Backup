import type QueryPattern from "../query_pattern";
import type gqlClient from "../client";
import Device from "../../device/device";
import type BasicQueryParameters from "../basicQueryParameters";
import SnapshotID from "../../device/snapshot";

export default class ComputerInfos implements QueryPattern {
    async compute_query (client: typeof gqlClient, query: string, parameters: BasicQueryParameters): Promise<Device> {
        const result = (await client.execute_query(query, parameters)).data.deviceInfos;
        const rawSnapshots = result.snapshots;
        const snapshots: [SnapshotID?] = []
        rawSnapshots.forEach((element: any) => {
            snapshots.push(
                new SnapshotID(
                    element.snapshotId,
                    element.snapshotDate
                )
            )
        });
        return new Device(
            result.name,
            result.processor,
            result.cores,
            result.memory,
            result.operatingSystem,
            snapshots
        )
    }
}
