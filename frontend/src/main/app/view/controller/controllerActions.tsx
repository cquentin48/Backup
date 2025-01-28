/**
 * Controller action blueprint
 */
export default interface ControllerAction {
    /**
     * Controller action set
     * @param {[object]} inputs Inputs set for the action
     */
    performAction(inputs: object[]): void;

    /**
     * Adds a new observable for later notifying
     * @param {string} name Name of the observable
     * @param {(updatedData: unknown[]) => void} callback Callback function used for the 
     * notification
     */
    addObservable(name: string, callback: (updatedData: unknown[]) => void): void;

    /**
     * Removes an observable
     * @param {string} name Name of the observer
     */
    removeObservable(name: string): void;
}

export type CallbackMethod = (updatedData: unknown[]) => void;

/**
 * Observable interface 
 */
export interface Observable {
    /**
     * Callback method based off the object name
     */
    [name: string] : CallbackMethod;
}