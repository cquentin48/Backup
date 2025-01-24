import type BasicQueryParameters from "./basicQueryParameters";
import type gqlClient from "./client";

export default interface QueryPattern {

    /**
     * Compute the query and returns the desired object
     * @param query GraphQL query
     * @param parameters GraphQL parameters
     * @returns query result
     */
    compute_query: (client: typeof gqlClient, query: string, parameters: BasicQueryParameters) => unknown | [unknown]
}
