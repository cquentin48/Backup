/** @type {import('jest').Config} */
global.console = {
    log: console.log,
    debug: jest.fn,
    info: jest.fn,
    warn: jest.fn,
    error: console.error
}

// Root dir storing every jest mock
const mockRootDir = __dirname.replace('jest', 'src/test/mocks')

// Mocked functions
// * MUI
// ** Material
jest.mock('@mui/material/Select',
    () => ({
        __esModule: true,
        default: require(`${mockRootDir}/material/select`).default
    })
);
jest.mock('@mui/material/MenuItem', () => ({
    __esModule: true,
    default: require(`${mockRootDir}/material/menuItem`).default
}));
jest.mock('@mui/material/TextField', () => ({
    __esModule: true,
    default: require(`${mockRootDir}/material/textfield`).default
}));
jest.mock('@mui/material/Tooltip', () => ({
    __esModule: true,
    default: require(`${mockRootDir}/material/tooltip`).default
}));
jest.mock('@mui/material/transitions', () => ({
    __esModule: true,
    default: require(`${mockRootDir}/material/transitions`).default
}));
// ** Data-Grid Library
jest.mock('@mui/x-data-grid', () => ({
    ...jest.requireActual("@mui/x-data-grid"),
    ...require(`${mockRootDir}/material/x-data-grid`).default
}));
// ** Date-Pickers
jest.mock('@mui/x-date-pickers', () => ({
    ...jest.requireActual('@mui/x-date-pickers'),
    DatePicker: require(`${mockRootDir}/material/datePicker`).default
}));

// * Notistack
jest.mock("notistack", () => {
    const actual = jest.requireActual("notistack");
    return {
        ...actual,
        useSnackbar: jest.fn()
    };
});

// * React-redux

/*
jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))*/