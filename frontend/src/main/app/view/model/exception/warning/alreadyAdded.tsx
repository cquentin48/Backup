/**
 * Warning exception for the item already added inside the array
 */
export default class AlreadyAddedWarning extends Error{
    /**
     * Exception construction method
     * @param {string} message Exception message
     */
    constructor(message: string){
        super(message);
        this.name = "AlreadyAddedWarning";
        Object.setPrototypeOf(this, AlreadyAddedWarning.prototype);
    }
    
}