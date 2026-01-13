import { create } from 'zustand';
import { getUserCollectionPath, subscribeToCollection, addDocument, updateDocument, deleteDocument, timestampToDate, dateToTimestamp } from '../utils/firestoreHelpers';
import { getCurrentUser } from '../services/auth';

const useBudgetStore = create((set, get) => ({
  expenses: [],
  loading: false,
  unsubscribe: null,

  setExpenses: (expenses) => set({ expenses }),

  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, 'expenses');
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: 'date', direction: 'desc' },
      (expenses) => {
        const processedExpenses = expenses.map(expense => ({
          ...expense,
          date: timestampToDate(expense.date),
          createdAt: timestampToDate(expense.createdAt),
        }));
        set({ expenses: processedExpenses });
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

  addExpense: async (expenseData) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'expenses');
      const expenseId = await addDocument(collectionPath, {
        amount: expenseData.amount,
        category: expenseData.category || 'Other',
        description: expenseData.description || '',
        date: dateToTimestamp(expenseData.date || new Date()),
      });
      return expenseId;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateExpense: async (id, updatedExpense) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'expenses');
      await updateDocument(collectionPath, id, {
        amount: updatedExpense.amount,
        category: updatedExpense.category,
        description: updatedExpense.description,
        date: dateToTimestamp(updatedExpense.date),
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteExpense: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'expenses');
      await deleteDocument(collectionPath, id);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getTotalByPeriod: (startDate, endDate) => {
    const { expenses } = get();
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  },

  getTotalByCategory: (category) => {
    const { expenses } = get();
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  },
}));

export default useBudgetStore;
