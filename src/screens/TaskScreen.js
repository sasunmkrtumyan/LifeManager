import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import useTaskStore from '../store/taskStore';

export default function TaskScreen() {
  const { tasks } = useTaskStore();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Tasks</Text>
        {tasks.length === 0 ? (
          <Text className="text-gray-500">No tasks yet. Add your first task!</Text>
        ) : (
          tasks.map((task) => (
            <View key={task.id} className="p-4 mb-2 bg-gray-100 rounded-lg">
              <Text className={`text-lg ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
