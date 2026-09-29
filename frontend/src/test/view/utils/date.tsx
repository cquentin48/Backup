export const DateUtils = {

    /**
     * From a date object in the MUI `DatePicker` object, build a formated date in the `string` format
     * @param {Date} rawDate date set in the DatePicker object
     * @returns {string}
     */
    formatDate: (rawDate: Date): string => {
        const year = rawDate["year"]()

        let month = rawDate["month"]() + 1
        if (month < 10) {
            month = `0${month}`
        }

        let date = rawDate["date"]()
        if (date < 10) {
            date = `0${date}`
        }

        return `${year}-${month}-${date}`
    }
}