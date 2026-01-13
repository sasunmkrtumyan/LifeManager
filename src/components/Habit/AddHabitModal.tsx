import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import useHabitStore from "../../store/habitStore";
import Button from "../Shared/Button";
import Input from "../Shared/Input";
import Modal from "../Shared/Modal";

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  habit?: {
    id: string;
    name: string;
    category?: string;
    reminderTime?: { hour: number; minute: number };
  };
}

const CATEGORIES = [
  "Health",
  "Fitness",
  "Work",
  "Personal",
  "Learning",
  "General",
];

export default function AddHabitModal({
  visible,
  onClose,
  habit,
}: AddHabitModalProps) {
  const { addHabit, updateHabit, loading } = useHabitStore();

  const [name, setName] = useState(habit?.name ?? "");
  const [category, setCategory] = useState(habit?.category ?? "General");
  const [reminderHour, setReminderHour] = useState(
    habit?.reminderTime?.hour ?? 9
  );
  const [reminderMinute, setReminderMinute] = useState(
    habit?.reminderTime?.minute ?? 0
  );

  // ✅ ՍԱ Է ՔՈ ՀԻՄՆԱԿԱՆ ՖԻՔՍԸ
  useEffect(() => {
    if (visible) {
      if (habit) {
        // Edit mode
        setName(habit.name);
        setCategory(habit.category || "General");
        setReminderHour(habit.reminderTime?.hour ?? 9);
        setReminderMinute(habit.reminderTime?.minute ?? 0);
      } else {
        // Add mode
        setName("");
        setCategory("General");
        setReminderHour(9);
        setReminderMinute(0);
      }
    }
  }, [visible, habit]);

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      if (habit) {
        await updateHabit(habit.id, {
          name,
          category,
          reminderTime: {
            hour: reminderHour,
            minute: reminderMinute,
          },
        });
      } else {
        await addHabit({
          name,
          category,
          reminderTime: {
            hour: reminderHour,
            minute: reminderMinute,
          },
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={habit ? "Edit Habit" : "Add Habit"}
    >
      <ScrollView>
        <Input
          label="Habit Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Drink water"
        />

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Category
          </Text>
          <View className="flex-row flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                title={cat}
                onPress={() => setCategory(cat)}
                variant={category === cat ? "primary" : "outline"}
                className="mr-2 mb-2"
              />
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Reminder Time
          </Text>
          <View className="flex-row items-center">
            <Input
              value={String(reminderHour)}
              onChangeText={(t) => setReminderHour(Number(t) || 9)}
              keyboardType="numeric"
              className="flex-1 mr-2"
            />
            <Text>:</Text>
            <Input
              value={String(reminderMinute)}
              onChangeText={(t) => setReminderMinute(Number(t) || 0)}
              keyboardType="numeric"
              className="flex-1 ml-2"
            />
          </View>
        </View>

        <Button
          title={habit ? "Update Habit" : "Add Habit"}
          onPress={handleSave}
          loading={loading}
          className="mt-4"
        />
      </ScrollView>
    </Modal>
  );
}
