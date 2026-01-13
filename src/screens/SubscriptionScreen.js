import { ScrollView, Text, View } from "react-native";
import useSubscriptionStore from "../store/subscriptionStore";

export default function SubscriptionScreen() {
  const { subscriptions } = useSubscriptionStore();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Subscriptions</Text>
        {subscriptions.length === 0 ? (
          <Text className="text-gray-500">No subscriptions tracked yet.</Text>
        ) : (
          subscriptions.map((sub) => (
            <View key={sub.id} className="p-4 mb-2 bg-gray-100 rounded-lg">
              <Text className="text-lg font-semibold">{sub.name}</Text>
              <Text className="text-gray-600">
                ${sub.amount} / {sub.billingCycle}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
