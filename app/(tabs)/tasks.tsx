import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import useTaskStore from "@/src/store/taskStore";
import { getCurrentUser, signInAnon, onAuthChange } from "@/src/services/auth";
import TaskCard from "@/src/components/Task/TaskCard";
import AddTaskModal from "@/src/components/Task/AddTaskModal";
import Button from "@/src/components/Shared/Button";

type FilterType = "all" | "active" | "completed" | "overdue";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date | string;
  completed: boolean;
}

export default function TasksScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, init, cleanup, getOverdueTasks } = useTaskStore();

  useEffect(() => {
    const initialize = async () => {
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = await signInAnon();
      }
      setUser(currentUser);
      if (currentUser) {
        init(currentUser.uid);
      }
    };

    initialize();

    const unsubscribe = onAuthChange((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
        init(authUser.uid);
      } else {
        setUser(null);
        cleanup();
      }
    });

    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  const filteredTasks = tasks.filter((task: { id: string; completed: boolean; dueDate?: Date | string | null }) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    if (filter === "overdue") {
      const overdue = getOverdueTasks();
      return overdue.some((t: { id: string }) => t.id === task.id);
    }
    return true;
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTask(null);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Tasks
          </Text>
          <Button
            title="+ Add"
            onPress={() => setModalVisible(true)}
            className="px-4 py-2"
          />
        </View>

        {/* Filters */}
        <View className="flex-row mb-4">
          {(["all", "active", "completed", "overdue"] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg mr-2 ${
                filter === f
                  ? "bg-blue-600 dark:bg-blue-500"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <Text
                className={`capitalize ${
                  filter === f
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView>
          {filteredTasks.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                No tasks found
              </Text>
            </View>
          ) : (
            filteredTasks.map((task: Task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => handleEdit(task)}
              >
                <TaskCard task={task} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <AddTaskModal
        visible={modalVisible}
        onClose={handleCloseModal}
        task={editingTask || undefined}
      />
    </View>
  );
}
