import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function NotesScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Notes</Text>
        <Text className="text-gray-500">Start writing your notes here.</Text>
      </View>
    </ScrollView>
  );
}
