import ValidationError from "../exception/errors/validationError";

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
    filterValue: object;

    /**
     * Constructor method
     * @param {"File" | "Library"} elementType type of element to filter (either ``file`` or ``library``)
     * @param { string } fieldName name of the field to apply the filter on
     * @param { '<' | '>' | '!=' | '==' } opType filter operation type
     * @param { object } filterValue value including or not elements with the filter on
     */
    constructor (
        elementType: "File" | "Library",
        fieldName: string,
        opType: '<' | '>' | '!=' | '==',
        filterValue: object) {
        this.elementType = elementType;
        this.fieldName = fieldName;
        this.opType = opType;
        this.filterValue = filterValue
    }

    /**
     * Authorized input type list
     * @param {string} inputType Input type check
     * @see {@link} Authorized input types
     */
    public static inputTypeAuthorizedList (inputType: string): void {
        const authorizedList = ["File", "Library"];
        if (!authorizedList.includes(inputType)) {
            throw new ValidationError(`The input type ${inputType} set is not valid. "+
                "The only ones accepted are : "File" or "Library".`)
        }
    }

    /**
     * Check if the comparison is in the authorized list
     * @param {string} comparaison Filter comparison operator
     * @see {@link} Authorized comparison operators
     */
    public static comparisonTypesCheck (comparaison: string): void {
        const authorizedList = ["<", ">", "!=", "=="];
        if (!authorizedList.includes(comparaison)) {
            throw new ValidationError(`The comparison ${comparaison} set is not valid. "+
                "The only ones accepted are : "<", ">", "!=" or "==".`)
        }
    }

    /**
     * Authorized type of input : ``File`` or ``Library``
     */
    public static authorizedInputTypes = ["File", "Library"];

    /**
     * Authorized comparison operations : ``<``, ``<=``, ``>``, ``>=``, ``!=``, ``==``
     *  or ``includes``.
     */
    public static authorizedComparisonOperations = ["<", "<=", ">", ">=", "!=", "==", "includes"];

    /**
     * Based of the ``inputType``, fetch every single field name
     * @param {"File" | "Library"} inputType Input type
     * @returns {string[]} Input field name list
     */
    public static inputFieldName (inputType: "File" | "Library" | ""): string[] {
        if (inputType === "File") {
            return ['name', 'creationDate', 'lastUpdateDate', 'size', 'path', 'type']
        } else if (inputType === "Library") {
            return ['name', 'firstUploadDate', 'lastUploadDate', 'size', 'repository', 'version']
        } else {
            return ['Please choose a type']
        }
    }
}
