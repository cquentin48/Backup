import type QueryPattern from "../query_pattern";
import type gqlClient from "../client";
import Computer from "../../computer/computer";
import type BasicQueryParameters from "../basicQueryParameters";
import Snapshot from "../../computer/saves";

export default class ComputerInfos implements QueryPattern {
    async compute_query (client: typeof gqlClient, query: string, parameters: BasicQueryParameters): Promise<Computer> {
        const result = (await client.execute_query(query, parameters)).data.deviceInfos;
        const rawSnapshots = result.snapshots;
        const snapshots: [Snapshot?] = []
        rawSnapshots.forEach((element: any) => {
            snapshots.push(
                new Snapshot(
                    element.snapshotId,
                    element.snapshotDate
                )
            )
        });
        return new Computer(
            result.name,
            result.processor,
            result.cores,
            result.memory,
            result.operatingSystem,
            snapshots
        )
    }
}
