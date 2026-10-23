/** @type {import('jest').Config} */
global.console = {
    log: console.log,
    debug: jest.fn,
    info: jest.fn,
    warn: jest.fn,
    error: console.error
}

// Root dir storing every jest mock
const mockRootDir = __dirname.replace('jest','src/test/mocks')

// Mocked functions
// * MUI
// ** Material
jest.mock('@mui/material/Select',require(`${mockRootDir}/material/select`));
jest.mock('@mui/material/MenuItem',require(`${mockRootDir}/material/menuItem`));
jest.mock('@mui/material/TextField', require(`${mockRootDir}/material/textfield`));
jest.mock('@mui/material/Tooltip',`${mockRootDir}/material/tooltip`);
jest.mock('@mui/material/transitions',require(`${mockRootDir}/material/transitions`));
// ** Data-Grid Library
jest.mock(`${mockRootDir}/material/x-data-grid`);
// ** Date-Pickers
jest.mock("@mui/x-date-pickers", require(`${mockRootDir}/material/x-date-pickers`));

// * Notistack
jest.mock(`${mockRootDir}/notistack/notistack`);