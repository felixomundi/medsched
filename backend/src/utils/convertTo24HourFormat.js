function convertTo24HourFormat(timeString) {
    const timeRegex = /(\d{1,2}):(\d{2}) (AM|PM)/;
    const match = timeString.match(timeRegex);

    if (!match) {
        return null;
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];

    // Convert 12-hour format to 24-hour format
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    // Format the time as "HH:mm:ss" for the SQL time data type
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    return formattedTime;
}

// let timeString = "08:00 AM";
// console.log(convertTo24HourFormat(timeString)); // Output: 08:00:00


module.exports = {
    convertTo24HourFormat
}