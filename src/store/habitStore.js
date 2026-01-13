import { create } from "zustand";
import { getCurrentUser } from "../services/auth";
import {
  cancelItemNotification,
  scheduleHabitReminder,
} from "../services/notifications";
import { calculateStreak } from "../utils/dateHelpers";
import {
  addDocument,
  deleteDocument,
  getUserCollectionPath,
  subscribeToCollection,
  timestampToDate,
  updateDocument,
} from "../utils/firestoreHelpers";

const useHabitStore = create((set, get) => ({
  habits: [],
  loading: false,
  unsubscribe: null,

  // Set habits (used by Firestore listener)
  setHabits: (habits) => set({ habits }),

  // Initialize Firestore listener
  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, "habits");
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: "createdAt", direction: "desc" },
      (habits) => {
        // Convert Firestore timestamps to dates
        const processedHabits = habits.map((habit) => ({
          ...habit,
          createdAt: timestampToDate(habit.createdAt),
          updatedAt: timestampToDate(habit.updatedAt),
          reminderTime: habit.reminderTime
            ? {
                hour: habit.reminderTime.hour,
                minute: habit.reminderTime.minute,
              }
            : null,
        }));
        set({ habits: processedHabits });
      }
    );

    set({ unsubscribe });
  },

  // Cleanup listener
  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  // Add habit
  addHabit: async (habitData) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, "habits");
      const habitId = await addDocument(collectionPath, {
        name: habitData.name,
        category: habitData.category || "General",
        frequency: habitData.frequency || "daily",
        reminderTime: habitData.reminderTime || null,
        completedDates: [],
      });

      // Schedule notification if reminder time is set
      if (habitData.reminderTime) {
        await scheduleHabitReminder(
          habitId,
          habitData.name,
          habitData.reminderTime.hour,
          habitData.reminderTime.minute
        );
      }

      return habitId;
    } catch (error) {
      console.error("Error adding habit:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update habit
  updateHabit: async (id, updatedHabit) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, "habits");
      await updateDocument(collectionPath, id, {
        name: updatedHabit.name,
        category: updatedHabit.category || "General",
        frequency: updatedHabit.frequency || "daily",
        reminderTime: updatedHabit.reminderTime || null,
      });

      // Update notification if reminder time changed
      if (updatedHabit.reminderTime) {
        await cancelItemNotification("habit", id);
        await scheduleHabitReminder(
          id,
          updatedHabit.name,
          updatedHabit.reminderTime.hour,
          updatedHabit.reminderTime.minute
        );
      }
    } catch (error) {
      console.error("Error updating habit:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete habit
  deleteHabit: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, "habits");
      await deleteDocument(collectionPath, id);

      // Cancel notification
      await cancelItemNotification("habit", id);
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Toggle habit completion for a date
  toggleHabitCompletion: async (id, date) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const { habits } = get();
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const completedDates = habit.completedDates || [];
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    const dateExists = completedDates.includes(dateStr);

    const newCompletedDates = dateExists
      ? completedDates.filter((d) => d !== dateStr)
      : [...completedDates, dateStr];

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, "habits");
      await updateDocument(collectionPath, id, {
        completedDates: newCompletedDates,
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Get habit streak
  getHabitStreak: (id) => {
    const { habits } = get();
    const habit = habits.find((h) => h.id === id);
    if (!habit) return 0;
    return calculateStreak(habit.completedDates || []);
  },

  // Check if habit is completed today
  isCompletedToday: (id) => {
    const { habits } = get();
    const habit = habits.find((h) => h.id === id);
    if (!habit) return false;
    const today = new Date().toISOString().split("T")[0];
    return (habit.completedDates || []).includes(today);
  },
}));

export default useHabitStore;
