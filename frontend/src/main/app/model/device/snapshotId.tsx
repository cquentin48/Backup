/**
 * Device snapshot header class
 * Composed of the index of database stored data and the upload date.
 */
export default class SnapshotID {
    key: string;
    date: Date;
    operatingSystem: string;

    /**
     * Construction method
     * @param { string } key snapshot database id
     * @param { string } uploadDate snapshot date upload (Must be of format ``YYYY``-``MM``-``DD``)
     * @param { string } operatingSystem related device snapshot operating system
     */
    constructor (key: string = "", uploadDate: string = "2000-01-01", operatingSystem: string = "") {
        this.key = key;
        this.date = new Date(uploadDate);
        this.operatingSystem = operatingSystem;
    }

    /**
     * Format the snapshot date for display in the web application according to the chosen language
     * @param {Date} date date used for the localized date
     * @returns {string} Localized snapshot upload date
     */
    static localizedDate (date: Date): string {
        const snapshotDate = new Date(date)
        return snapshotDate.toLocaleDateString(window.navigator.language, {
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
        const idCondition = this.key === "";
        const uploadDate = this.date;
        const year = uploadDate.getFullYear().toString()
        const month = (uploadDate.getMonth() + 1) < 10 ? `0${uploadDate.getMonth() + 1}` : (uploadDate.getMonth() + 1).toString()
        const day = (uploadDate.getDate()) < 10 ? `0${uploadDate.getDate()}` : uploadDate.getDate().toString()
        const parsedDate = `${year}-${month}-${day}`
        const uploadDateCondition = parsedDate === "2000-01-01"
        const operatingSystemCondition = this.operatingSystem === ""

        return idCondition && uploadDateCondition && operatingSystemCondition
    }
}
