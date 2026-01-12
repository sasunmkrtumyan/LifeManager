import { create } from 'zustand';

const useHabitStore = create((set) => ({
  habits: [],
  
  addHabit: (habit) => set((state) => ({
    habits: [...state.habits, { ...habit, id: Date.now().toString() }],
  })),
  
  updateHabit: (id, updatedHabit) => set((state) => ({
    habits: state.habits.map((habit) =>
      habit.id === id ? { ...habit, ...updatedHabit } : habit
    ),
  })),
  
  deleteHabit: (id) => set((state) => ({
    habits: state.habits.filter((habit) => habit.id !== id),
  })),
  
  toggleHabitCompletion: (id, date) => set((state) => ({
    habits: state.habits.map((habit) => {
      if (habit.id === id) {
        const completedDates = habit.completedDates || [];
        const dateExists = completedDates.includes(date);
        
        return {
          ...habit,
          completedDates: dateExists
            ? completedDates.filter((d) => d !== date)
            : [...completedDates, date],
        };
      }
      return habit;
    }),
  })),
}));

export default useHabitStore;
