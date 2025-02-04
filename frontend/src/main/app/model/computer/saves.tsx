/**
 * Device snapshot header class
 * Composed of the index of database stored data and the upload date.
 */
export default class SnapshotID {
    id: string;
    uploadDate: Date;

    /**
     * Construction method
     * @param { string } id snapshot database id
     * @param { string } uploadDate snapshot date upload
     */
    constructor (id: string, uploadDate: string) {
        this.id = id;
        const uploadDateArray = uploadDate.split('-');
        this.uploadDate = new Date(
            parseInt(uploadDateArray[0]),
            parseInt(uploadDateArray[1]),
            parseInt(uploadDateArray[2])
        );
    }

    /**
     * Format the snapshot upload date for display in the web application
     * @returns {string} Localized snapshot upload date
     */
    localizedUploadDate (): string {
        return this.uploadDate.toLocaleDateString(window.navigator.language, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
        )
    }
}
