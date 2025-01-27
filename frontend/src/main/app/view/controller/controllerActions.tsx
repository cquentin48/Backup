/**
 * Controller action blueprint
 */
export default interface ControllerAction{
    /**
     * Controller action set
     * @param {[object]} inputs Inputs set for the action
     */
    performAction(inputs:object[]):void;
}