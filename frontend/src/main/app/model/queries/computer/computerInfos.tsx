import type QueryPattern from "../query_pattern";
import type gqlClient from "../client";
import Device from "../../device/device";
import type BasicQueryParameters from "../basicQueryParameters";
import SnapshotID from "../../device/snapshot";
import { type DocumentNode } from "@apollo/client";

export default class ComputerInfos implements QueryPattern {
    async compute_query (client: typeof gqlClient, query: DocumentNode, parameters: BasicQueryParameters): Promise<Device> {
        const result = (await client.execute_query(query, parameters)).data.deviceInfos;
        const rawSnapshots = result.snapshots;
        console.log(rawSnapshots)
        const snapshots: SnapshotID[] = []
        rawSnapshots.forEach((element: any) => {
            snapshots.push(
                new SnapshotID(
                    element.key,
                    element.date,
                    element.operatingSystem
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
