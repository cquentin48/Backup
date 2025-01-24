/**
 * Filter object used in the device main informations pie charts
 */
export default class Filter {
    /**
     * Type of element to filter (either ``file`` or ``library``)
     */
    elementType: string;

    /**
     * Name of the field to apply the filter on
     */
    fieldName: string;

    /**
     * Filter operation type (e.g. ``<`` or ``>``)
     */
    opType: string;

    /**
     * Value including or not elements with the filter on
     */
    fieldValue: object;

    /**
     * Constructor method
     * @param {"File" | "Library"} elementType type of element to filter (either ``file`` or ``library``)
     * @param { string } fieldName name of the field to apply the filter on
     * @param { '<' | '>' | '!=' | '==' } opType filter operation type
     * @param { object } fieldValue value including or not elements with the filter on
     */
    constructor (
        elementType: "File" | "Library",
        fieldName: string,
        opType: '<' | '>' | '!=' | '==',
        fieldValue: object) {
        this.elementType = elementType;
        this.fieldName = fieldName;
        this.opType = opType;
        this.fieldValue = fieldValue
    }
}
