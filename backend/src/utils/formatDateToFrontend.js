function formatDateToFrontend(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    let month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    let day = formattedDate.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
module.exports = {
    formatDateToFrontend
}  