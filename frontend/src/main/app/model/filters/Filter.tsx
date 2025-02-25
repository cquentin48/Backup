import NotFoundError from "../exception/errors/notFoundError"
import ValidationError from "../exception/errors/validationError"

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

export type FilterElementType = "File" | "Library"
export type FilterComparisonType = "<" | "<=" | ">" | ">=" | "!=" | "==" | "includes" | "startswith" | "endswith"
export type FilterSoftwareFieldName = "name" | "firstUploadDate" | "lastUploadDate" | "size" | "repository" | "version"

/**
 * Filter object used in the device main informations pie charts
 */
export default class Filter {
    /**
     * Type of element to filter (either ``file`` or ``library``)
     */
    elementType: FilterElementType;

    /**
     * Name of the field to apply the filter on
     */
    fieldName: string;

    /**
     * Filter operation type (e.g. ``<`` or ``>``)
     */
    opType: FilterComparisonType;

    /**
     * Value including or not elements with the filter on
     */
    value: object;

    /**
     * Filter ID in the filter table
     */
    id: number;

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
        opType: '<' | '>' | '!=' | '==' | "includes",
        filterValue: object,
        id: number) {
        this.elementType = elementType;
        this.fieldName = fieldName;
        this.opType = opType;
        this.value = filterValue;
        this.id = id;
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
     * Check if this filter and another one are equal
     * @param {Filter} otherFilter Other filter for comparison
     * @returns {boolean} ``true`` yes | ``false`` no
     */
    public isEqual(otherFilter: Filter){
        const elementTypeCheck = this.elementType === otherFilter.elementType;
        const fieldNameCheck = this.fieldName === otherFilter.fieldName;
        const comparisonTypeCheck = this.opType === otherFilter.opType;
        const valueCheck = this.value === otherFilter.value;
        return elementTypeCheck && fieldNameCheck && comparisonTypeCheck && valueCheck
    }

    /**
     * Check if the comparison is in the authorized list
     * @param {string} comparaison Filter comparison operator
     * @see {@link} Authorized comparison operators
     */
    public static comparisonTypesCheck (comparaison: string): void {
        const authorizedList = ["<", "<=", ">", ">=", "!=", "==", "includes"];
        if (!authorizedList.includes(comparaison)) {
            throw new ValidationError(`The comparison ${comparaison} set is not valid. "+
                "The only ones accepted are : "<", "<=", ">", ">=", "!=", "==" or "includes".`)
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
    public static authorizedComparisonOperationsString = ["<", "<=", ">", ">=", "!=", "==", "includes", "starts with", "ends with"];

    /**
     * Authorized comparison operations : ``<``, ``<=``, ``>``, ``>=``, ``!=``, ``==``
     *  or ``includes``.
     */
    public static authorizedComparisonOperationsNumber = ["<", "<=", ">", ">=", "!=", "=="];

    /**
     * Authorized comparison operations : ``<``, ``<=``, ``>``, ``>=``, ``!=`` or ``==``.
     */
    public static authorizedComparisonOperationsDate = ["<", "<=", ">", ">=", "!=", "=="];

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
                            comparisonOperators: Filter.authorizedComparisonOperationsString
                        }
                    ],
                    [
                        "creationDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperationsDate
                        }
                    ],
                    [
                        "lastUpdateDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperationsDate
                        }
                    ],
                    [
                        "size", {
                            inputType: 'number',
                            comparisonOperators: Filter.authorizedComparisonOperationsNumber
                        }
                    ],
                    [
                        "path", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperationsString
                        }
                    ],
                    [
                        "type", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperationsString
                        }
                    ]
                ]
            )],
            ["Library", new Map<string, FilterInputDetails>(
                [
                    [
                        "name", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperationsString
                        }
                    ],
                    [
                        "firstUploadDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperationsDate
                        }
                    ],
                    [
                        "lastUploadDate", {
                            inputType: 'date',
                            comparisonOperators: Filter.authorizedComparisonOperationsDate
                        }
                    ],
                    [
                        "size", {
                            inputType: 'number',
                            comparisonOperators: Filter.authorizedComparisonOperationsNumber
                        }
                    ],
                    [
                        "repository", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperationsString
                        }
                    ],
                    [
                        "version", {
                            inputType: 'text',
                            comparisonOperators: Filter.authorizedComparisonOperationsString
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
