/**
 * Device snapshot header class
 * Composed of the index of database stored data and the upload date.
 */
export default class SnapshotID {
    id: string;
    uploadDate: Date;
    operatingSystem: string;

    /**
     * Construction method
     * @param { string } id snapshot database id
     * @param { string } uploadDate snapshot date upload (Must be of format ``YYYY``-``MM``-``DD``)
     */
    constructor (id: string, uploadDate: string, operatingSystem: string) {
        this.id = id;
        const uploadDateArray = uploadDate.split('-');
        this.uploadDate = new Date(
            parseInt(uploadDateArray[0]),
            parseInt(uploadDateArray[1]),
            parseInt(uploadDateArray[2])
        );
        this.operatingSystem = operatingSystem;
    }

    /**
     * Format the snapshot date for display in the web application according to the chosen language
     * @returns {string} Localized snapshot upload date
     */
    localizedDate (): string {
        return this.uploadDate.toLocaleDateString(window.navigator.language, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
        )
    }
}
