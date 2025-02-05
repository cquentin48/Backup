import type QueryPattern from "../query_pattern";
import type gqlClient from "../client";
import type BasicQueryParameters from "../basicQueryParameters";
import { SnapshotData } from "../../snapshot/snapshotData";

import { dataManager } from '../../AppDataManager';

class SnapshotGQLData implements QueryPattern {
    async compute_query (client: typeof gqlClient, query: string, parameters: BasicQueryParameters): Promise<SnapshotData> {
        const rawSnapshotData = (await client.execute_query(query, parameters)).data.snapshotInfos;
        const rawSoftwares = rawSnapshotData.versions;
        const snapshot = new SnapshotData();
        rawSoftwares.forEach((softwareRaw: any) => {
            const version = softwareRaw.softwareVersion;
            const name = softwareRaw.name;
            const installType = softwareRaw.softwareInstallType;
            snapshot.addSoftware(
                version,
                name,
                installType
            );
        });
        return snapshot;
    }
}

export const snapshotGQLData = new SnapshotGQLData();
