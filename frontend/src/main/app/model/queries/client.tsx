import { ApolloClient, type ApolloQueryResult, InMemoryCache, type NormalizedCacheObject, gql } from '@apollo/client';

import { Config } from '../../config/backupConfig';

/**
 * Backup frontend graphQL query client interface manager
 */
class BackupQueryClient {
    private readonly query_client: ApolloClient<NormalizedCacheObject>;

    constructor () {
        this.query_client = new ApolloClient({
            uri: Config.GQL_BACKENDURI,
            cache: new InMemoryCache()
        });
    }

    /**
     * Getter for the query client (used only in the app component)
     * @returns GraphQL query client
     */
    get_query_client (): ApolloClient<NormalizedCacheObject> {
        return this.query_client;
    }

    /**
     * Execute a graphQL query and returns the results
     * @param query GraphQL query
     * @param variables query variables
     * @returns Result of the query
     */
    async execute_query (query: string, variables: [object]): Promise<ApolloQueryResult<any>> {
        if (variables !== undefined && variables.length > 0) {
            const data = await this.query_client.query({
                query: gql`${query}`,
                variables
            })
            return data
        }
        try {
            const data = await this.query_client.query({
                query: gql`${query}`
            })
            return data
        } catch (e) {
            console.error(e)
            console.log(variables)
            throw e
        }
    }
}

const gqlClient = new BackupQueryClient();

export default gqlClient;
