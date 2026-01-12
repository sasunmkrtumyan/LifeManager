import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function BudgetScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Budget</Text>
        <Text className="text-gray-500">Track your expenses and budget here.</Text>
      </View>
    </ScrollView>
  );
}
