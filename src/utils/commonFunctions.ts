// Helper function to convert time string to hours
export function getHoursFromTime(timeStr: string) {
    const [hourStr, period] = timeStr.split(" ");
    let hour = parseInt(hourStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour;
}