import { ApolloClient, type ApolloQueryResult, InMemoryCache, type NormalizedCacheObject, gql } from '@apollo/client';

import { Config } from '../../config/backupConfig';
import BasicQueryParameters from './basicQueryParameters';

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
     * @param queryPath GraphQL query path
     * @param variables query variables
     * @returns Result of the query
     */
    async execute_query (queryPath: string, variables: BasicQueryParameters|undefined): Promise<ApolloQueryResult<any>> {
        if (variables !== undefined) {
            const data = await this.query_client.query({
                query: gql`${queryPath}`,
                variables
            })
            return data
        }
        try {
            const data = await this.query_client.query({
                query: gql`${queryPath}`
            })
            return data
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

const gqlClient = new BackupQueryClient();

export default gqlClient;
