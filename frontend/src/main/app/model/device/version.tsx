/**
 * Package version chosen by a save
 */
export default class Version {
    /**
     * Name of the related package
     */
    name: string;

    /**
     * Name of the type of the package
     */
    packageType: string;

    /**
     * Version number of the package
     */
    versionId: string;

    /**
     * Public constructor for the object
     * @param { string } name name of the related package
     * @param { string } packageType name of the type of the package
     * @param { string } versionId version of the package
     */
    public constructor (name: string, packageType: string, versionId: string) {
        this.name = name;
        this.packageType = packageType;
        this.versionId = versionId;
    }
}
