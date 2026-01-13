import { Platform } from 'react-native';

// Gracefully handle expo-notifications import (not fully supported in Expo Go)
let Notifications;
try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.warn('expo-notifications not available in Expo Go. Notifications will be disabled.');
  Notifications = null;
}
import {
  scheduleDailyNotification,
  scheduleOneTimeNotification,
  scheduleNotificationBeforeDate,
  scheduleNotificationDaysBefore,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  generateNotificationId,
} from '../utils/notificationHelpers';

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const registerForPushNotificationsAsync = async () => {
  if (!Notifications) {
    console.warn('Notifications not available');
    return null;
  }
  
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  
  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  return token;
};

export const scheduleNotification = async (title, body, trigger) => {
  if (!Notifications) {
    console.warn('Notifications not available');
    return null;
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger,
  });
};

/**
 * Schedule daily habit reminder
 */
export const scheduleHabitReminder = async (habitId, habitName, hour, minute = 0) => {
  const identifier = generateNotificationId('habit', habitId);
  return await scheduleDailyNotification(
    identifier,
    'Habit Reminder',
    `Don't forget: ${habitName}`,
    hour,
    minute
  );
};

/**
 * Schedule task deadline reminder (1 hour before)
 */
export const scheduleTaskReminder = async (taskId, taskTitle, dueDate) => {
  const identifier = generateNotificationId('task', taskId);
  return await scheduleNotificationBeforeDate(
    identifier,
    'Task Reminder',
    `Due soon: ${taskTitle}`,
    dueDate,
    1 // 1 hour before
  );
};

/**
 * Schedule subscription payment reminder (1 day before)
 */
export const scheduleSubscriptionReminder = async (subscriptionId, subscriptionName, paymentDate) => {
  const identifier = generateNotificationId('subscription', subscriptionId);
  return await scheduleNotificationDaysBefore(
    identifier,
    'Payment Reminder',
    `${subscriptionName} payment due tomorrow`,
    paymentDate,
    1 // 1 day before
  );
};

/**
 * Schedule water intake reminder
 */
export const scheduleWaterReminder = async (userId, hour, minute = 0) => {
  const identifier = generateNotificationId('water', userId);
  return await scheduleDailyNotification(
    identifier,
    'Stay Hydrated',
    'Remember to drink water!',
    hour,
    minute
  );
};

/**
 * Schedule medicine dose reminder
 */
export const scheduleMedicineReminder = async (medicineId, medicineName, doseTime) => {
  const identifier = generateNotificationId('medicine', `${medicineId}_${doseTime}`);
  
  // Parse doseTime (e.g., "09:00" or "09:00,21:00")
  const times = doseTime.split(',');
  
  // For multiple doses per day, schedule each one
  const promises = times.map(async (time, index) => {
    const [hours, minutes] = time.trim().split(':').map(Number);
    const fullIdentifier = `${identifier}_${index}`;
    return await scheduleDailyNotification(
      fullIdentifier,
      'Medicine Reminder',
      `Time to take: ${medicineName}`,
      hours,
      minutes
    );
  });
  
  return await Promise.all(promises);
};

/**
 * Cancel a notification by type and ID
 */
export const cancelItemNotification = async (type, itemId) => {
  const identifier = generateNotificationId(type, itemId);
  await cancelNotification(identifier);
};

/**
 * Re-export helper functions
 */
export {
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  generateNotificationId,
};
