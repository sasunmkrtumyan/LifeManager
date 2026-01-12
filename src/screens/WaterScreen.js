import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function WaterScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Water Tracker</Text>
        <Text className="text-gray-500">Track your daily water intake.</Text>
      </View>
    </ScrollView>
  );
}
