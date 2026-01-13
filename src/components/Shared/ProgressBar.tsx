import React from 'react';
import { View, Text } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  color?: string;
  className?: string;
}

export default function ProgressBar({
  progress,
  height = 8,
  showLabel = false,
  color = 'bg-blue-600',
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View className={`w-full ${className}`}>
      {showLabel && (
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {Math.round(clampedProgress)}%
        </Text>
      )}
      <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" style={{ height }}>
        <View
          className={`${color} h-full rounded-full transition-all`}
          style={{ width: `${clampedProgress}%` }}
        />
      </View>
    </View>
  );
}
