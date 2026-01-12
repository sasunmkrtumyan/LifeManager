import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import useHabitStore from '../store/habitStore';

export default function HabitScreen() {
  const { habits } = useHabitStore();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Habits</Text>
        {habits.length === 0 ? (
          <Text className="text-gray-500">No habits yet. Add your first habit!</Text>
        ) : (
          habits.map((habit) => (
            <View key={habit.id} className="p-4 mb-2 bg-gray-100 rounded-lg">
              <Text className="text-lg font-semibold">{habit.name}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
