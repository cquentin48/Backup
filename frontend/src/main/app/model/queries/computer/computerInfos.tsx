import type QueryPattern from "../query_pattern";
import type gqlClient from "../client";
import Computer from "../../computer/computer";
import { type ApolloQueryResult } from "@apollo/client";

export default class ComputerInfos implements QueryPattern {
    async compute_query (client: typeof gqlClient, query: string, parameters: [object]): Promise<ApolloQueryResult<Computer>> {
        let result = await client.execute_query(query, parameters)
        result = result.data;
        return Object.assign(
            result, Computer
        )
    }
}
