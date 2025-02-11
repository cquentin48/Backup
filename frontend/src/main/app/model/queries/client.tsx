import {
    ApolloClient, type ApolloQueryResult,
    type DocumentNode, HttpLink, InMemoryCache,
    type NormalizedCacheObject, gql } from '@apollo/client';
import fetch from 'cross-fetch';

import { Config } from '../../config/backupConfig';
import type BasicQueryParameters from './basicQueryParameters';

/**
 * Backup frontend graphQL query client interface manager
 */
class BackupQueryClient {
    private readonly query_client: ApolloClient<NormalizedCacheObject>;

    constructor () {
        this.query_client = new ApolloClient({
            uri: Config.GQL_BACKENDURI,
            cache: new InMemoryCache(),
            link: new HttpLink({ uri: Config.GQL_BACKENDURI, fetch })
        });
    }

    /**
     * Getter for the query client (used only in the app component)
     * @returns {ApolloClient<NormalizedCacheObject>} GraphQL query client
     */
    get_query_client (): ApolloClient<NormalizedCacheObject> {
        return this.query_client;
    }

    /**
     * Execute a graphQL query and returns the results
     * @param { string } query GraphQL query
     * @param { BasicQueryParameters } variables query variables
     * @returns { Promise<ApolloQueryResult<any>> } Result of the query
     */
    async execute_query (query: DocumentNode, variables: BasicQueryParameters | undefined): Promise<ApolloQueryResult<any>> {
        if (variables !== undefined) {
            const data = await this.query_client.query({
                query: query,
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
            throw e
        }
    }
}

const gqlClient = new BackupQueryClient();

export default gqlClient;
