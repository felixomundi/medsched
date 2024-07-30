function formatDateToBackend(date) {
    const parts = date.split('-'); // Assuming date is in 'YYYY-MM-DD' format
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
  
    // Construct a new Date object with the components
    const formattedDate = new Date(year, month - 1, day); // month - 1 because months are 0-indexed in JavaScript
  
    // Check if the constructed date is valid
    if (isNaN(formattedDate.getTime())) {
      return null;
    }
  
    // Return the formatted date object or string as needed by our backend
    return formattedDate; 
  }


  module.exports = {
    formatDateToBackend
  }