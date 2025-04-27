
/**
 * Snapshot software data
 */
export class SnapshotSoftware {
    /**
     * Software version used in the snapshot
     */
    chosenVersion: string;

    /**
     * Software name
     */
    name: string;

    /**
     * Software installation source (e.g. apt, microsoft store, appstore, ...)
     */
    installType: string;

    /**
     * Constructor method
     * @param {string} softwareVersion Software version
     * @param {string} softwareName Software name
     * @param {string} softwareInstallType Software installation source (e.g. apt, microsoft store, appstore, ...)
     */
    constructor (softwareVersion: string, softwareName: string, softwareInstallType: string) {
        this.chosenVersion = softwareVersion;
        this.name = softwareName;
        this.installType = softwareInstallType;
    }
}
