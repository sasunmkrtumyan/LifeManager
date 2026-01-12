import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Welcome to LifeManager</Text>
        <Text className="text-gray-600">Your personal life management dashboard</Text>
      </View>
    </ScrollView>
  );
}
