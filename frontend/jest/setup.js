/** @type {import('jest').Config} */
global.console = {
    log: console.log,
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}