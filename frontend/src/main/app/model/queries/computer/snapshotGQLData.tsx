import { type DocumentNode } from "@apollo/client";
import type QueryPattern from "../query_pattern";
import type gqlClient from "../client";
import type BasicQueryParameters from "../basicQueryParameters";
import { SnapshotData } from "../../snapshot/snapshotData";

class SnapshotGQLData implements QueryPattern {
    async compute_query (client: typeof gqlClient, query: DocumentNode, parameters: BasicQueryParameters): Promise<SnapshotData> {
        const rawSnapshotData = (await client.execute_query(query, parameters)).data.snapshotInfos;
        const rawSoftwares = rawSnapshotData.versions;
        const snapshot = new SnapshotData();
        rawSoftwares.forEach((softwareRaw: any) => {
            const chosenVersion = softwareRaw.chosenVersion;
            const name = softwareRaw.name;
            const installType = softwareRaw.installType;
            snapshot.addSoftware(
                chosenVersion,
                name,
                installType
            );
        });
        return snapshot;
    }
}

export const snapshotGQLData = new SnapshotGQLData();
