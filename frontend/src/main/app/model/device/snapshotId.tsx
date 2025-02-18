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
     * @param { string } operatingSystem related device snapshot operating system
     */
    constructor (id: string = "", uploadDate: string = "2000-01-01", operatingSystem: string = "") {
        this.id = id;
        this.uploadDate = new Date(uploadDate);
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

    /**
     * Check if the snapshot ID is undefined or not
     * @returns {boolean} ``true`` yes | ``false`` no
     */
    isUndefined (): boolean {
        const idCondition = this.id === "";
        const uploadDate = this.uploadDate;
        const year = uploadDate.getFullYear().toString()
        const month = (uploadDate.getMonth() + 1) < 10 ? `0${uploadDate.getMonth() + 1}` : (uploadDate.getMonth() + 1).toString()
        const day = (uploadDate.getDate()) < 10 ? `0${uploadDate.getDate()}` : uploadDate.getDate().toString()
        const parsedDate = `${year}-${month}-${day}`
        const uploadDateCondition = parsedDate === "2000-01-01"
        const operatingSystemCondition = this.operatingSystem === ""

        return idCondition && uploadDateCondition && operatingSystemCondition
    }
}
