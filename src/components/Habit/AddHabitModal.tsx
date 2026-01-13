import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Button from '../Shared/Button';
import useHabitStore from '../../store/habitStore';

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

const CATEGORIES = ['Health', 'Fitness', 'Work', 'Personal', 'Learning', 'General'];

export default function AddHabitModal({ visible, onClose, habit }: AddHabitModalProps) {
  const { addHabit, updateHabit, loading } = useHabitStore();
  const [name, setName] = useState(habit?.name || '');
  const [category, setCategory] = useState(habit?.category || 'General');
  const [reminderHour, setReminderHour] = useState(habit?.reminderTime?.hour || 9);
  const [reminderMinute, setReminderMinute] = useState(habit?.reminderTime?.minute || 0);

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      if (habit) {
        await updateHabit(habit.id, {
          name,
          category,
          reminderTime: { hour: reminderHour, minute: reminderMinute },
        });
      } else {
        await addHabit({
          name,
          category,
          reminderTime: { hour: reminderHour, minute: reminderMinute },
        });
      }
      onClose();
      setName('');
      setCategory('General');
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={habit ? 'Edit Habit' : 'Add Habit'}>
      <ScrollView>
        <Input
          label="Habit Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Drink water, Exercise"
        />

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </Text>
          <View className="flex-row flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                title={cat}
                onPress={() => setCategory(cat)}
                variant={category === cat ? 'primary' : 'outline'}
                className="mr-2 mb-2"
              />
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reminder Time (Optional)
          </Text>
          <View className="flex-row items-center">
            <Input
              value={reminderHour.toString()}
              onChangeText={(text) => setReminderHour(parseInt(text) || 9)}
              keyboardType="numeric"
              className="flex-1 mr-2"
              placeholder="Hour"
            />
            <Text className="text-gray-600 dark:text-gray-400 mx-2">:</Text>
            <Input
              value={reminderMinute.toString()}
              onChangeText={(text) => setReminderMinute(parseInt(text) || 0)}
              keyboardType="numeric"
              className="flex-1"
              placeholder="Minute"
            />
          </View>
        </View>

        <Button
          title={habit ? 'Update Habit' : 'Add Habit'}
          onPress={handleSave}
          loading={loading}
          className="mt-4"
        />
      </ScrollView>
    </Modal>
  );
}
