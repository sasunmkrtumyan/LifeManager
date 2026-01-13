import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Card from '../Shared/Card';
import { formatDisplayDate } from '../../utils/dateHelpers';

interface SubscriptionCardProps {
  subscription: {
    id: string;
    name: string;
    amount: number;
    billingCycle: 'monthly' | 'yearly';
    nextPaymentDate: Date | string;
  };
  onPress?: () => void;
}

export default function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const monthlyAmount = subscription.billingCycle === 'yearly'
    ? subscription.amount / 12
    : subscription.amount;

  return (
    <Card className="mb-3">
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {subscription.name}
            </Text>
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              ${subscription.amount.toFixed(2)}
              <Text className="text-sm font-normal text-gray-500 dark:text-gray-400">
                /{subscription.billingCycle === 'yearly' ? 'year' : 'month'}
              </Text>
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Next payment: {formatDisplayDate(subscription.nextPaymentDate)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
