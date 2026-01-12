import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function CalendarScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Calendar</Text>
        <Text className="text-gray-500">Your calendar events will appear here.</Text>
      </View>
    </ScrollView>
  );
}
