import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Card from '../Shared/Card';
import useTaskStore from '../../store/taskStore';
import { formatDisplayDate, isPast } from '../../utils/dateHelpers';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date | string;
    completed: boolean;
  };
  onPress?: () => void;
}

const PRIORITY_COLORS = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export default function TaskCard({ task, onPress }: TaskCardProps) {
  const { toggleTaskCompletion } = useTaskStore();
  const isOverdue = task.dueDate && !task.completed && isPast(task.dueDate);

  const handleToggle = async () => {
    await toggleTaskCompletion(task.id);
  };

  return (
    <Card className={`mb-3 ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View className="flex-row items-start">
          <TouchableOpacity
            onPress={handleToggle}
            className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 mt-1 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {task.completed && <Text className="text-white text-sm">✓</Text>}
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className={`text-lg font-semibold ${
                task.completed
                  ? 'line-through text-gray-400'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {task.description}
              </Text>
            )}
            <View className="flex-row items-center mt-2">
              <View
                className={`px-2 py-1 rounded ${PRIORITY_COLORS[task.priority]} mr-2`}
              >
                <Text className="text-white text-xs font-medium capitalize">
                  {task.priority}
                </Text>
              </View>
              {task.dueDate && (
                <Text
                  className={`text-xs ${
                    isOverdue
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isOverdue ? '⚠️ ' : ''}
                  {formatDisplayDate(task.dueDate)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
