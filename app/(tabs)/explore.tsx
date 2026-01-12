import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HabitsScreen() {
  const [habits] = useState([
    { id: 1, name: "Morning Exercise", streak: 7, completed: true },
    { id: 2, name: "Read 30 minutes", streak: 3, completed: false },
    { id: 3, name: "Drink 8 glasses of water", streak: 12, completed: true },
  ]);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800">My Habits</Text>
          <Text className="text-gray-600 mt-2">
            Build consistency, one day at a time
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row mb-6">
          <View className="bg-white rounded-lg p-4 mr-3 flex-1 shadow-sm">
            <Text className="text-2xl font-bold text-blue-600">3</Text>
            <Text className="text-gray-600 mt-1">Active Habits</Text>
          </View>
          <View className="bg-white rounded-lg p-4 flex-1 shadow-sm">
            <Text className="text-2xl font-bold text-green-600">12</Text>
            <Text className="text-gray-600 mt-1">Longest Streak</Text>
          </View>
        </View>

        {/* Add Habit Button */}
        <TouchableOpacity className="bg-blue-600 rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-white text-center font-semibold text-lg">
            + Add New Habit
          </Text>
        </TouchableOpacity>

        {/* Habits List */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          Todays Habits
        </Text>

        {habits.map((habit) => (
          <View
            key={habit.id}
            className="bg-white rounded-lg p-5 mb-3 shadow-sm"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {habit.name}
                </Text>
                <Text className="text-gray-600 mt-1">
                  🔥 {habit.streak} day streak
                </Text>
              </View>
              <View
                className={`w-8 h-8 rounded-full ${
                  habit.completed ? "bg-green-500" : "bg-gray-300"
                } items-center justify-center`}
              >
                {habit.completed && (
                  <Text className="text-white font-bold">✓</Text>
                )}
              </View>
            </View>
          </View>
        ))}

        {/* Empty State */}
        {habits.length === 0 && (
          <View className="bg-white rounded-lg p-8 items-center shadow-sm">
            <Text className="text-gray-600 text-center">
              No habits yet. Start building better habits today!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
