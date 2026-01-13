import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Card from '../Shared/Card';
import useHabitStore from '../../store/habitStore';

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    category?: string;
    completedDates?: string[];
  };
  onPress?: () => void;
}

export default function HabitCard({ habit, onPress }: HabitCardProps) {
  const { toggleHabitCompletion, getHabitStreak, isCompletedToday } = useHabitStore();
  const streak = getHabitStreak(habit.id);
  const completedToday = isCompletedToday(habit.id);
  const today = new Date().toISOString().split('T')[0];

  const handleToggle = async () => {
    await toggleHabitCompletion(habit.id, today);
  };

  return (
    <Card className="mb-3">
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {habit.name}
            </Text>
            {habit.category && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {habit.category}
              </Text>
            )}
            <View className="flex-row items-center mt-2">
              <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                🔥 {streak} day streak
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleToggle}
            className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
              completedToday
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {completedToday && <Text className="text-white text-lg">✓</Text>}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
