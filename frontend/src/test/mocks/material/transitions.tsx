

// Jest Material.UI `transition` mock function

//jest.mock('@mui/material/transitions', () => ({
const mockedTransitions = ({
    ...jest.requireActual('@mui/material/transitions'),
    useTransitionProps: () => ({ timeout: 0 })
});