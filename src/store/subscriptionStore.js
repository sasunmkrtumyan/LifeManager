import { create } from 'zustand';
import { getUserCollectionPath, subscribeToCollection, addDocument, updateDocument, deleteDocument, timestampToDate, dateToTimestamp } from '../utils/firestoreHelpers';
import { scheduleSubscriptionReminder, cancelItemNotification } from '../services/notifications';
import { getCurrentUser } from '../services/auth';
import { addDays } from '../utils/dateHelpers';

const useSubscriptionStore = create((set, get) => ({
  subscriptions: [],
  loading: false,
  unsubscribe: null,

  setSubscriptions: (subscriptions) => set({ subscriptions }),

  init: (userId) => {
    const { unsubscribe: existingUnsubscribe } = get();
    if (existingUnsubscribe) {
      existingUnsubscribe();
    }

    const collectionPath = getUserCollectionPath(userId, 'subscriptions');
    const unsubscribe = subscribeToCollection(
      collectionPath,
      [],
      { field: 'createdAt', direction: 'desc' },
      (subscriptions) => {
        const processedSubs = subscriptions.map(sub => ({
          ...sub,
          createdAt: timestampToDate(sub.createdAt),
          updatedAt: timestampToDate(sub.updatedAt),
          startDate: timestampToDate(sub.startDate),
          nextPaymentDate: timestampToDate(sub.nextPaymentDate),
        }));
        set({ subscriptions: processedSubs });
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

  addSubscription: async (subscriptionData) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const startDate = subscriptionData.startDate || new Date();
      const billingCycle = subscriptionData.billingCycle || 'monthly';
      const nextPaymentDate = billingCycle === 'yearly'
        ? addDays(startDate, 365)
        : addDays(startDate, 30);

      const collectionPath = getUserCollectionPath(user.uid, 'subscriptions');
      const subscriptionId = await addDocument(collectionPath, {
        name: subscriptionData.name,
        amount: subscriptionData.amount,
        billingCycle: billingCycle,
        startDate: dateToTimestamp(startDate),
        nextPaymentDate: dateToTimestamp(nextPaymentDate),
        category: subscriptionData.category || 'Other',
      });

      // Schedule payment reminder
      await scheduleSubscriptionReminder(
        subscriptionId,
        subscriptionData.name,
        nextPaymentDate
      );

      return subscriptionId;
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateSubscription: async (id, updatedSubscription) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'subscriptions');
      const updateData = {
        name: updatedSubscription.name,
        amount: updatedSubscription.amount,
        billingCycle: updatedSubscription.billingCycle,
        category: updatedSubscription.category,
      };

      if (updatedSubscription.startDate) {
        updateData.startDate = dateToTimestamp(updatedSubscription.startDate);
        // Recalculate next payment date
        const billingCycle = updatedSubscription.billingCycle || 'monthly';
        const nextPaymentDate = billingCycle === 'yearly'
          ? addDays(updatedSubscription.startDate, 365)
          : addDays(updatedSubscription.startDate, 30);
        updateData.nextPaymentDate = dateToTimestamp(nextPaymentDate);
      }

      await updateDocument(collectionPath, id, updateData);

      // Update notification
      if (updateData.nextPaymentDate) {
        await cancelItemNotification('subscription', id);
        await scheduleSubscriptionReminder(
          id,
          updatedSubscription.name,
          timestampToDate(updateData.nextPaymentDate)
        );
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteSubscription: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    set({ loading: true });
    try {
      const collectionPath = getUserCollectionPath(user.uid, 'subscriptions');
      await deleteDocument(collectionPath, id);
      await cancelItemNotification('subscription', id);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getTotalMonthlyExpense: () => {
    const { subscriptions } = get();
    return subscriptions.reduce((total, sub) => {
      const monthlyCost = sub.billingCycle === 'yearly' 
        ? sub.amount / 12 
        : sub.amount;
      return total + monthlyCost;
    }, 0);
  },
}));

export default useSubscriptionStore;
