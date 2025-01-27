/**
 * Error with index outside of array range
 */
export default class ValidationError extends Error{
    /**
     * Error construction methode
     * @param {string} message Error ressage
     */
    constructor(message: string){
        super(message);
        this.name = "NotFoundError";

        Object.setPrototypeOf(this, ValidationError.prototype)
    }
}