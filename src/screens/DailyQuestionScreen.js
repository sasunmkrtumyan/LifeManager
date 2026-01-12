import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function DailyQuestionScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Daily Question</Text>
        <Text className="text-gray-500">Answer your daily reflection question.</Text>
      </View>
    </ScrollView>
  );
}
