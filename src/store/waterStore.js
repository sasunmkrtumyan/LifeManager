import { create } from 'zustand';
import { getUserCollectionPath, subscribeToCollection, addDocument, updateDocument, getDocuments, timestampToDate, dateToTimestamp } from '../utils/firestoreHelpers';
import { scheduleWaterReminder, cancelItemNotification } from '../services/notifications';
import { getCurrentUser } from '../services/auth';
import { getToday, formatDate } from '../utils/dateHelpers';

const useWaterStore = create((set, get) => ({
  waterLogs: [],
  dailyGoal: 2000, // ml, default 2L
  loading: false,
  unsubscribe: null,

  setWaterLogs: (logs) => set({ waterLogs: logs }),

  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, 'waterLogs');
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: 'date', direction: 'desc' },
      (logs) => {
        const processedLogs = logs.map(log => ({
          ...log,
          date: timestampToDate(log.date),
          createdAt: timestampToDate(log.createdAt),
        }));
        set({ waterLogs: processedLogs });
      }
    );

    set({ unsubscribe });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  setDailyGoal: async (goal) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ dailyGoal: goal, loading: true });
    try {
      // Store goal in user document
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');
      await setDoc(doc(db, 'users', user.uid), {
        waterDailyGoal: goal,
      }, { merge: true });
    } catch (error) {
      console.error('Error setting daily goal:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addWaterIntake: async (amount, date = new Date()) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'waterLogs');
      const dateStr = formatDate(date);
      
      // Check if log exists for today
      const existingLogs = await getDocuments(collectionPath, [
        { field: 'date', operator: '==', value: dateToTimestamp(date) }
      ]);

      if (existingLogs.length > 0) {
        // Update existing log
        const existingLog = existingLogs[0];
        await updateDocument(collectionPath, existingLog.id, {
          amount: existingLog.amount + amount,
        });
      } else {
        // Create new log
        await addDocument(collectionPath, {
          amount,
          date: dateToTimestamp(date),
        });
      }
    } catch (error) {
      console.error('Error adding water intake:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getTodayIntake: () => {
    const { waterLogs } = get();
    const today = getToday();
    const todayLog = waterLogs.find(log => formatDate(log.date) === today);
    return todayLog ? todayLog.amount : 0;
  },

  getProgress: () => {
    const { dailyGoal } = get();
    const todayIntake = get().getTodayIntake();
    return Math.min((todayIntake / dailyGoal) * 100, 100);
  },
}));

export default useWaterStore;
