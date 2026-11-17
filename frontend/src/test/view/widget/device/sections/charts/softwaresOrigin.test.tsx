import React from "react"
import '@testing-library/jest-dom'

import SoftwareOrigins from "../../../../../../main/app/view/pages/computer/sections/charts/SoftwareOrigins"
import { initInitialState, renderWithProviders, initApolloMock, renderMockedComponent } from "../../../../utils/utils"
import { useSnackbar } from "notistack"
import Device from "../../../../../../main/app/model/device/device"
import Filter from "../../../../../../main/app/model/filters/Filter"
import SnapshotID from "../../../../../../main/app/model/device/snapshotId"
import { SnapshotData } from "../../../../../../main/app/model/snapshot/snapshotData"


describe("Type of softwares origin chart unit test suite", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    const initEnqueueSnackbarMock = (): jest.Mock => {
        const mockEnqueueSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });
        return mockEnqueueSnackbar
    }


    test("Pending render", async () => {
        // Given
        const initialState = initInitialState("loadingDevice", undefined, undefined, undefined);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("loadingDevice", undefined, undefined);

        initEnqueueSnackbarMock();

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (single software)", async () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );
        const snapshot = new SnapshotData();
        snapshot.addSoftware("test", "test software", "1.0");

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Acts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, other included)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 7; i++) {
            snapshot.addSoftware("1.0", `My ${i}-th software`, `${i}th-type`)
        }
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `My ${i}-th software`, `type`)
        }
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type, filter == applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `My ${i}-th software`, `type`)
        }

        const filters = [
            new Filter("Library", "name", "==", "My 0-th software" as unknown as object, 0)
        ]
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type, filter != applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        };

        const filters = [
            new Filter("Library", "name", "≠", "b" as unknown as object, 0)
        ];

        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type, filter < applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        }

        const filters = [
            new Filter("Library", "name", "<", "b" as unknown as object, 0)
        ]
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type, filter <= applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        }

        const filters = [
            new Filter("Library", "name", "<=", "b" as unknown as object, 0)
        ]

        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type, filter > applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        }

        const filters = [
            new Filter("Library", "name", ">", "a" as unknown as object, 0)
        ]


        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type, filter >= applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        }

        const filters = [
            new Filter("Library", "name", ">=", "b" as unknown as object, 0)
        ]

        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Successful render (Multiple softwares, same type, filter startswith applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        }

        const filters = [
            new Filter("Library", "name", "startswith", "a" as unknown as object, 0)
        ]

        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })


    test("Successful render (Multiple softwares, same type, filter endswith applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        }

        const filters = [
            new Filter("Library", "name", "endswith", "b" as unknown as object, 0)
        ]


        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })


    test("Successful render (Multiple softwares, same type, filter includes applied)", async () => {
        // Given
        const snapshot = new SnapshotData()
        for (let i = 0; i < 2; i++) {
            snapshot.addSoftware("1.0", `${String.fromCharCode(97 + i)}`, `type`)
        }

        const filters = [
            new Filter("Library", "name", "includes", "a" as unknown as object, 0)
        ]

        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        );

        const initialState = initInitialState("success", ["device", "snapshot", "filter"], snapshot, device, filters, filters.map((filter) => filter.id));
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("success", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment()).toMatchSnapshot()
    })

    test("Failure in render", () => {
        // Given
        const device = new Device(
            "MyDevice",
            "My processor",
            1,
            4e+9,
            [new SnapshotID(
                "1",
                "2020-01-01",
                "Ubuntu"
            )]
        )
        const snapshot = new SnapshotData();
        initEnqueueSnackbarMock();

        const initialState = initInitialState("deviceError", ["device", "snapshot"], snapshot, device);
        const store = renderWithProviders(initialState);
        const apolloMocks = initApolloMock("deviceError", undefined, device);

        // Acts
        const { asFragment } = renderMockedComponent(store, apolloMocks, <SoftwareOrigins />);

        // Asserts
        expect(asFragment).toMatchSnapshot()
    })
})
