import React from "react";

import { render } from "@testing-library/react"
import TopBar from "../../../main/app/view/pages/computer/topbar";

import '@testing-library/jest-dom'
import { initApolloMock, initInitialState, renderMockedComponent, renderWithProviders } from "../utils/utils";
import { useSnackbar } from "notistack";

describe("Topbar unit test suite", () => {
    /**
     * Mock ``enqueueSnackbar`` function
     * @returns {jest.Mock} Mocked ``enqueueSnackbar`` function
     */
    const initEnqueueSnackbarMock = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn((message: string, variants) => "");
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        return mockEnqueueSnackbar
    }

    test("Successful render", async () => {
        // Before
        const initialState = initInitialState("loadingDevice", undefined, undefined, undefined);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, undefined);

        initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <TopBar/>, false);

        // Assert
        expect(asFragment()).toMatchSnapshot()
    })
})
