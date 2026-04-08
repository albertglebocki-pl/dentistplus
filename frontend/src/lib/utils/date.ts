export function getWeekNumber(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
}

export function getWeekFirstDay(date: Date): number {
    const d = new Date(date);

    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);

    return d.getDate();
}
