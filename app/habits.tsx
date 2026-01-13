import AddHabitModal from "@/src/components/Habit/AddHabitModal";
import HabitCard from "@/src/components/Habit/HabitCard";
import Button from "@/src/components/Shared/Button";
import { getCurrentUser, onAuthChange, signInAnon } from "@/src/services/auth";
import useHabitStore from "@/src/store/habitStore";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Habit {
  id: string;
  name: string;
  category?: string;
  reminderTime?: { hour: number; minute: number };
}

export default function HabitsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { habits, init, cleanup } = useHabitStore();

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

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingHabit(null);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Habits
          </Text>
          <Button
            title="+ Add"
            onPress={() => setModalVisible(true)}
            className="px-4 py-2"
          />
        </View>

        <ScrollView>
          {habits.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                No habits yet. Add your first habit!
              </Text>
            </View>
          ) : (
            habits.map((habit: Habit) => (
              <TouchableOpacity
                key={habit.id}
                onPress={() => handleEdit(habit)}
              >
                <HabitCard habit={habit} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <AddHabitModal
        key={editingHabit ? editingHabit.id : "new-habit"}
        visible={modalVisible}
        onClose={handleCloseModal}
        habit={editingHabit || undefined}
      />
    </View>
  );
}
