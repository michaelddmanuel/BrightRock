/**
 * Formats a date string or Date object into a readable date format
 * 
 * @param {string|Date} dateStr - The date to format
 * @param {Object} options - Formatting options passed to Intl.DateTimeFormat
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return 'N/A';
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  
  // Default options
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-ZA', defaultOptions).format(date);
};

/**
 * Formats a date string or Date object into a readable date and time format
 * 
 * @param {string|Date} dateStr - The date to format
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  
  return formatDate(dateStr, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculates the time difference between two dates in a human-readable format
 * 
 * @param {string|Date} startDate - The start date
 * @param {string|Date} endDate - The end date (defaults to now)
 * @returns {string} - Human-readable time difference
 */
export const timeAgo = (startDate, endDate = new Date()) => {
  if (!startDate) return 'N/A';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const seconds = Math.floor((end - start) / 1000);
  
  // Time periods in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  // Find the appropriate interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return 'Just now';
};
