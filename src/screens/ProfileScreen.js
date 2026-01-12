import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Profile</Text>
        <Text className="text-gray-500">Manage your profile and settings.</Text>
      </View>
    </ScrollView>
  );
}
