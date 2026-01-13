import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
