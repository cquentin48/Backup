/**
 * Controller action blueprint
 */
export default interface ControllerAction {
    /**
     * List of every observable linked to the controller
     */
    observable: Observable

    /**
     * Controller action set
     * @param {[unknown]} inputs Inputs set for the action
     */
    performAction: (inputs: unknown[]) => void

    /**
     * Adds a new observable for later notification
     * @param {string} name Name of the observable
     * @param {(updatedData: unknown[]) => void} callback Callback function used for the
     * notification
     */
    addObservable: (name: string, callback: (updatedData: unknown[]) => void) => void

    /**
     * Removes an observable
     * @param {string} name Name of the observer
     */
    removeObservable: (name: string) => void
}

export type CallbackMethod = (updatedData: unknown[]) => void;

/**
 * Observable interface
 */
export type Observable = Record<string, CallbackMethod>;
