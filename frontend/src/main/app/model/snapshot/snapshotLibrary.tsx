
export class SnapshotSoftware {
    version: string;
    name: string;
    installType: string;

    constructor (softwareVersion: string, softwareName: string, softwareInstallType: string) {
        this.version = softwareVersion;
        this.name = softwareName;
        this.installType = softwareInstallType;
    }
}
