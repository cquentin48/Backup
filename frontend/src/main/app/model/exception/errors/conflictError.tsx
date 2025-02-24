/**
 * Error with index outside of array range
 */
export default class ConflictError extends Error {
    /**
     * Error construction methode
     * @param {string} message Error ressage
     */
    constructor (message: string) {
        super(message);
        this.name = "ConflictError";

        Object.setPrototypeOf(this, ConflictError.prototype)
    }
}
