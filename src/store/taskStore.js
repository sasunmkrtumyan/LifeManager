import { create } from 'zustand';

const useTaskStore = create((set) => ({
  tasks: [],
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Date.now().toString(), completed: false }],
  })),
  
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    ),
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  
  toggleTaskCompletion: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ),
  })),
}));

export default useTaskStore;
