import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ModalProps,
} from 'react-native';

interface CustomModalProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  ...props
}: CustomModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      {...props}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-gray-800 rounded-t-3xl max-h-[90%]">
          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  className="p-2"
                >
                  <Text className="text-2xl text-gray-500 dark:text-gray-400">×</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <ScrollView className="p-4">
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
