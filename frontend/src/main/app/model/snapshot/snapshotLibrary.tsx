
export class SnapshotSoftware{
    softwareVersion: string;
    softwareName: string;
    softwareInstallType: string;

    constructor(softwareVersion:string, softwareName: string, softwareInstallType:string){
        this.softwareVersion = softwareVersion;
        this.softwareName = softwareName;
        this.softwareInstallType = softwareInstallType;
    }
}