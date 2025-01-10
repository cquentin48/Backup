/**
 * Package version chosen by a save
 */
export default class Version{
    name: string;
    packageType: string;
    versionId: string;

    /**
     * Public constructor for the object
     * @param name name of the related package
     * @param packageType name of the type of the package
     * @param versionId version number of the package
     */
    public constructor(name:string, packageType: string, versionId:string){
        this.name = name;
        this.packageType = packageType;
        this.versionId = versionId;
    }
}