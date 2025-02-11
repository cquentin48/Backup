/** @type {import('jest').Config} */
const original = console.log
const originalError = console.error

global.console = {
    log: console.log,
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: originalError
}