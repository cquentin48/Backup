/** @type {import('jest').Config} */
const original = console.log
const originalError = console.error

global.console = {
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}