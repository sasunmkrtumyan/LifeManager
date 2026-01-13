/**
 * Date utility functions for the Life Manager app
 */

/**
 * Format date to YYYY-MM-DD string
 */
export const formatDate = (date) => {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Get today's date as YYYY-MM-DD
 */
export const getToday = () => {
  return formatDate(new Date());
};

/**
 * Get start of day timestamp
 */
export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day timestamp
 */
export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  return formatDate(date) === getToday();
};

/**
 * Check if date is in the past
 */
export const isPast = (date) => {
  return new Date(date) < getStartOfDay();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date) => {
  return new Date(date) > getEndOfDay();
};

/**
 * Add days to a date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get days difference between two dates
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export const formatDisplayDate = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time for display (e.g., "2:30 PM")
 */
export const formatTime = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get month start and end dates
 */
export const getMonthRange = (date = new Date()) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start, end };
};

/**
 * Get all dates in a month
 */
export const getDatesInMonth = (date = new Date()) => {
  const { start, end } = getMonthRange(date);
  const dates = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(formatDate(new Date(current)));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

/**
 * Calculate streak from completion dates array
 */
export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates]
    .map(d => formatDate(d))
    .sort()
    .reverse();
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  return streak;
};
