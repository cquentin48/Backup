import NotFoundError from "../../../model/exception/errors/notFoundError";
import ValidationError from "../../../model/exception/errors/validationError";

/**
 * Filter DOM Input details
 */
interface FilterInputDetails {
    /**
     * Type of the input (e.g. ``date``, ``text``)
     */
    inputType: string

    /**
     * Allowed comparaison function|operators
     */
    comparisonOperators: string[]
}

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

    /**
     * Input Types data
     */
    private static readonly filterTypes: Map<string, Map<string, FilterInputDetails>> = new Map<string, Map<string, FilterInputDetails>>(
        [
            ["File", new Map<string, FilterInputDetails>(
                [
                    [
                        "name", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "creationDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "lastUpdateDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "size", {
                            inputType: 'number',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "path", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "type", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ]
                ]
            )],
            ["Library", new Map<string, FilterInputDetails>(
                [
                    [
                        "name", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "firstUploadDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "lastUploadDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "size", {
                            inputType: 'number',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "repository", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ],
                    [
                        "version", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperations
                        }
                    ]
                ]
            )],
            ["Other", new Map<string, FilterInputDetails>(
                [
                    [
                        "Please choose a type", {
                            inputType: 'text',
                            comparisonOperators: ['-']
                        }
                    ]
                ]
            )]
        ]
    )

    /**
     * From a specific field name and type, update the fitler input type
     * @param {string} inputType type of the input (``File`` or ``Library`` or ``Undefined``)
     * @param {string} inputName Name of the input field name
     * @returns {string} Filter DOM input type
     */
    public static getFieldNameType = (inputType: string, inputName: string): string => {
        const filterInputType = Filter.filterTypes.get(inputType)
        if (filterInputType === undefined) {
            throw new NotFoundError(`No input ${inputType} found`)
        }
        const filterInputTypeName = filterInputType.get(inputName) as FilterInputDetails
        return filterInputTypeName.inputType
    }
}
