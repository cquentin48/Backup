import ComputerInfos from "../../../../main/app/model/queries/computer/computerInfos";
import ComputerDataQuery from "../../../../main/res/queries/computer_infos.graphql";
import gqlClient from "../../../../main/app/model/queries/client";

import { process } from '@graphql-tools/jest-transform';

describe("Computer infos tests", ()=>{
    test("Simple graphql request", ()=>{
        // Given
        const queryClient = new ComputerInfos()
        console.log(ComputerDataQuery.definitions)
        expect(ComputerDataQuery).toBeDefined()

        // Acts
        queryClient.compute_query(
            gqlClient,
            ComputerDataQuery,
            {computerId:"1"}
        )
    })
})