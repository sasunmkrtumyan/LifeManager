/**
 * Notification scheduling helper functions
 */
// @ts-expect-error - expo-notifications module types
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Schedule a daily notification at a specific time
 */
export const scheduleDailyNotification = async (identifier, title, body, hour, minute = 0) => {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    return identifier;
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
    throw error;
  }
};

/**
 * Schedule a one-time notification at a specific date/time
 */
export const scheduleOneTimeNotification = async (identifier, title, body, date) => {
  try {
    // Don't schedule if date is in the past
    if (new Date(date) < new Date()) {
      return null;
    }

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        sound: true,
      },
      trigger: date,
    });
    return identifier;
  } catch (error) {
    console.error('Error scheduling one-time notification:', error);
    throw error;
  }
};

/**
 * Schedule a notification X hours before a date
 */
export const scheduleNotificationBeforeDate = async (identifier, title, body, targetDate, hoursBefore = 1) => {
  try {
    const notificationDate = new Date(targetDate);
    notificationDate.setHours(notificationDate.getHours() - hoursBefore);
    
    // Don't schedule if notification time is in the past
    if (notificationDate < new Date()) {
      return null;
    }

    return await scheduleOneTimeNotification(identifier, title, body, notificationDate);
  } catch (error) {
    console.error('Error scheduling notification before date:', error);
    throw error;
  }
};

/**
 * Schedule a notification X days before a date
 */
export const scheduleNotificationDaysBefore = async (identifier, title, body, targetDate, daysBefore = 1) => {
  try {
    const notificationDate = new Date(targetDate);
    notificationDate.setDate(notificationDate.getDate() - daysBefore);
    notificationDate.setHours(9, 0, 0, 0); // Default to 9 AM
    
    // Don't schedule if notification time is in the past
    if (notificationDate < new Date()) {
      return null;
    }

    return await scheduleOneTimeNotification(identifier, title, body, notificationDate);
  } catch (error) {
    console.error('Error scheduling notification days before:', error);
    throw error;
  }
};

/**
 * Cancel a scheduled notification
 */
export const cancelNotification = async (identifier) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error canceling notification:', error);
    throw error;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
    throw error;
  }
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Generate a unique notification identifier
 */
export const generateNotificationId = (type, itemId) => {
  return `${type}_${itemId}`;
};
