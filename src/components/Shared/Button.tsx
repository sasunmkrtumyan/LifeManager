import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  style,
  textStyle,
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 dark:bg-blue-500',
    secondary: 'bg-gray-600 dark:bg-gray-500',
    danger: 'bg-red-600 dark:bg-red-500',
    outline: 'bg-transparent border-2 border-blue-600 dark:border-blue-500',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    danger: 'text-white',
    outline: 'text-blue-600 dark:text-blue-400',
  };

  const disabledClasses = disabled || loading ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563eb' : '#ffffff'} />
      ) : (
        <Text
          className={`font-semibold text-base ${textVariantClasses[variant]}`}
          style={textStyle}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
