/**
 * Error with index outside of array range
 */
export default class NotFoundError extends Error{
    /**
     * Error construction methode
     * @param {string} message Error ressage
     */
    constructor(message: string){
        super(message);
        this.name = "NotFoundError";

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}