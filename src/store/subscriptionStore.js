import { create } from 'zustand';

const useSubscriptionStore = create((set) => ({
  subscriptions: [],
  
  addSubscription: (subscription) => set((state) => ({
    subscriptions: [...state.subscriptions, { ...subscription, id: Date.now().toString() }],
  })),
  
  updateSubscription: (id, updatedSubscription) => set((state) => ({
    subscriptions: state.subscriptions.map((sub) =>
      sub.id === id ? { ...sub, ...updatedSubscription } : sub
    ),
  })),
  
  deleteSubscription: (id) => set((state) => ({
    subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
  })),
  
  getTotalMonthlyExpense: () => {
    const { subscriptions } = useSubscriptionStore.getState();
    return subscriptions.reduce((total, sub) => {
      const monthlyCost = sub.billingCycle === 'yearly' 
        ? sub.amount / 12 
        : sub.amount;
      return total + monthlyCost;
    }, 0);
  },
}));

export default useSubscriptionStore;
