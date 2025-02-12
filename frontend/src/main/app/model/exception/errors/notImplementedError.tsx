/**
 * Error with index outside of array range
 */
export default class NotImplementedError extends Error {
    /**
     * Error construction methode
     * @param {string} message Error ressage
     */
    constructor (message: string) {
        super(message);
        this.name = "NotImplementedError";

        Object.setPrototypeOf(this, NotImplementedError.prototype)
    }
}
