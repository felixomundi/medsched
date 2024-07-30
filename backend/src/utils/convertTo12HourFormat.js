function convertTo12HourFormat(timeString) {
    const timeRegex = /(\d{2}):(\d{2}):(\d{2})/;
    const match = timeString.match(timeRegex);

    if (!match) {
        return null;
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 or 12 to 12, and 13-23 to 1-11

    // Format the time as "hh:mm AM/PM"
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

    return formattedTime;
}
module.exports ={
    convertTo12HourFormat
}