export function formatDateTime(dateStr: string): string {
    const dateObj = new Date(dateStr);
  
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = dateObj.getFullYear();
  
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

export function formatDateTime_validfrom (date: string, time: string): string {
  const dateObject = new Date(`${date}T${time}`); 
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const formattedDateTime = dateObject.toLocaleString('en-GB', options);
  
  return formattedDateTime.replace(/\//g, '-').replace(',', '');
};
