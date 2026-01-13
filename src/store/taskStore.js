import { create } from 'zustand';
import { getUserCollectionPath, subscribeToCollection, addDocument, updateDocument, deleteDocument, timestampToDate, dateToTimestamp } from '../utils/firestoreHelpers';
import { scheduleTaskReminder, cancelItemNotification } from '../services/notifications';
import { getCurrentUser } from '../services/auth';
import { isPast } from '../utils/dateHelpers';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  unsubscribe: null,

  setTasks: (tasks) => set({ tasks }),

  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, 'tasks');
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: 'createdAt', direction: 'desc' },
      (tasks) => {
        const processedTasks = tasks.map(task => ({
          ...task,
          createdAt: timestampToDate(task.createdAt),
          updatedAt: timestampToDate(task.updatedAt),
          dueDate: task.dueDate ? timestampToDate(task.dueDate) : null,
        }));
        set({ tasks: processedTasks });
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

  addTask: async (taskData) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'tasks');
      const taskId = await addDocument(collectionPath, {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate ? dateToTimestamp(taskData.dueDate) : null,
        completed: false,
      });

      // Schedule reminder if due date is set
      if (taskData.dueDate) {
        await scheduleTaskReminder(taskId, taskData.title, taskData.dueDate);
      }

      return taskId;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (id, updatedTask) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'tasks');
      const updateData = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
      };

      if (updatedTask.dueDate) {
        updateData.dueDate = dateToTimestamp(updatedTask.dueDate);
      }

      await updateDocument(collectionPath, id, updateData);

      // Update notification if due date changed
      if (updatedTask.dueDate) {
        await cancelItemNotification('task', id);
        await scheduleTaskReminder(id, updatedTask.title, updatedTask.dueDate);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'tasks');
      await deleteDocument(collectionPath, id);
      await cancelItemNotification('task', id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleTaskCompletion: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { tasks } = get();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'tasks');
      await updateDocument(collectionPath, id, {
        completed: !task.completed,
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getOverdueTasks: () => {
    const { tasks } = get();
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      isPast(task.dueDate)
    );
  },

  getTasksByPriority: (priority) => {
    const { tasks } = get();
    return tasks.filter(task => task.priority === priority && !task.completed);
  },
}));

export default useTaskStore;
