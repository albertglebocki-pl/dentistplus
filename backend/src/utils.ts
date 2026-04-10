export function getWeekDates(year: number, week: number) {
    const firstDay = new Date(year, 0, 1 + (week - 1) * 7)
    const day = firstDay.getDay()

    const monday = new Date(firstDay)
    if (day <= 4) {
        monday.setDate(firstDay.getDate() - firstDay.getDay() + 1)
    } else {
        monday.setDate(firstDay.getDate() + 8 - firstDay.getDay())
    }

    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    return {monday, friday}
}