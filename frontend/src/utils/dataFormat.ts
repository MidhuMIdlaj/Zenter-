export const formatDateForInput = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  console.log(dateString, "23456")
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString);
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
  

export const formatDateForApi = (inputDate: string | null | undefined): string | null => {
    if (!inputDate) return null;
    try {
      const date = new Date(inputDate);
      if (isNaN(date.getTime())) return null;
      
      return date.toISOString();
    } catch {
      return null;
    }
  };