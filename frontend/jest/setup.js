/** @type {import('jest').Config} */
const original = console.log

global.console = {
    log: original,
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}