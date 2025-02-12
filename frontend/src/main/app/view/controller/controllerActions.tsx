import NotFoundError from "../../model/exception/errors/notFoundError";
import NotImplementedError from "../../model/exception/errors/notImplementedError";

/**
 * Controller action blueprint
 */
export default class ControllerAction {
    /**
     * List of every observable linked to the controller
     */
    protected observable: Observable = {};

    public constructor(){}

    /**
     * Controller action set
     * @param {string} inputs Inputs set for the action
     */
    public performAction (inputs: string): void {
        throw new NotImplementedError("The method is virtual. Please inherit this class.")
    }

    addObservable (name: string, callback: (updatedData: string) => void): void {
        this.observable[name] = callback
    }

    removeObservable (name: string): void {
        if (!(name in this.observable)) {
            throw new NotFoundError(`The observable with the key name ${name} has not been set!`)
        }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.observable[name];
    }

    /**
     * Fetch the observable based off its name.
     * @param {string} name Observable name
     * @returns {Observable} observable used for later callback
     */
    getObservable (name: string): CallbackMethod {
        if (!(name in this.observable)) {
            throw new NotFoundError(`The related view component ${name}` +
                " hasn't been mounted yet!")
        }
        const tableViewObservable = this.observable[name]
        return tableViewObservable;
    }
}

export type CallbackMethod = (updatedData: string) => void;

/**
 * Observable interface
 */
export type Observable = Record<string, CallbackMethod>;
