import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Card from '../Shared/Card';
import ProgressBar from '../Shared/ProgressBar';
import useWaterStore from '../../store/waterStore';

export default function WaterGoalCard() {
  const { dailyGoal, getTodayIntake, getProgress } = useWaterStore();
  const todayIntake = getTodayIntake();
  const progress = getProgress();

  const addWater = async (amount: number) => {
    await useWaterStore.getState().addWaterIntake(amount);
  };

  return (
    <Card className="mb-4">
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          💧 Water Intake Today
        </Text>
        <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {todayIntake}ml / {dailyGoal}ml
        </Text>
      </View>

      <ProgressBar progress={progress} height={12} showLabel />

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          onPress={() => addWater(250)}
          className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg"
        >
          <Text className="text-blue-700 dark:text-blue-300 font-medium">+250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addWater(500)}
          className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg"
        >
          <Text className="text-blue-700 dark:text-blue-300 font-medium">+500ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addWater(1000)}
          className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg"
        >
          <Text className="text-blue-700 dark:text-blue-300 font-medium">+1L</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
