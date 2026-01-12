export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const sortedDates = completedDates.sort((a, b) => b - a);
  let streak = 1;
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = Math.floor((sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
