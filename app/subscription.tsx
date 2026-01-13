import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import useSubscriptionStore from "@/src/store/subscriptionStore";
import { getCurrentUser, signInAnon, onAuthChange } from "@/src/services/auth";
import SubscriptionCard from "@/src/components/Subscription/SubscriptionCard";
import Card from "@/src/components/Shared/Card";
import Button from "@/src/components/Shared/Button";
import Modal from "@/src/components/Shared/Modal";
import Input from "@/src/components/Shared/Input";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextPaymentDate?: Date | string;
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const { subscriptions, init, cleanup, addSubscription, updateSubscription, deleteSubscription, getTotalMonthlyExpense, loading } = useSubscriptionStore();

  useEffect(() => {
    const initialize = async () => {
      let currentUser = getCurrentUser();
      if (!currentUser) {
        currentUser = await signInAnon();
      }
      setUser(currentUser);
      if (currentUser) {
        init(currentUser.uid);
      }
    };

    initialize();

    const unsubscribe = onAuthChange((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
        init(authUser.uid);
      } else {
        setUser(null);
        cleanup();
      }
    });

    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !amount) return;

    try {
      if (editingSub) {
        await updateSubscription(editingSub.id, {
          name,
          amount: parseFloat(amount),
          billingCycle,
        });
      } else {
        await addSubscription({
          name,
          amount: parseFloat(amount),
          billingCycle,
        });
      }
      setModalVisible(false);
      setName("");
      setAmount("");
      setBillingCycle("monthly");
      setEditingSub(null);
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setName(sub.name);
    setAmount(sub.amount.toString());
    setBillingCycle(sub.billingCycle);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription(id);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const monthlyTotal = getTotalMonthlyExpense();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Subscriptions
          </Text>
          <Button
            title="+ Add"
            onPress={() => setModalVisible(true)}
            className="px-4 py-2"
          />
        </View>

        {subscriptions.length > 0 && (
          <Card className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Monthly Total
            </Text>
            <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${monthlyTotal.toFixed(2)}
            </Text>
          </Card>
        )}

        <ScrollView>
          {subscriptions.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                No subscriptions yet. Add your first subscription!
              </Text>
            </View>
          ) : (
            subscriptions.map((sub: Subscription) => (
              <View key={sub.id}>
                <TouchableOpacity onPress={() => handleEdit(sub)}>
                  <SubscriptionCard subscription={{ ...sub, nextPaymentDate: sub.nextPaymentDate || new Date() }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(sub.id)}
                  className="ml-auto mb-2"
                >
                  <Text className="text-red-600 dark:text-red-400 text-sm">Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingSub(null);
          setName("");
          setAmount("");
          setBillingCycle("monthly");
        }}
        title={editingSub ? "Edit Subscription" : "Add Subscription"}
      >
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Netflix, Spotify"
        />
        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
        />
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Billing Cycle
          </Text>
          <View className="flex-row">
            <Button
              title="Monthly"
              onPress={() => setBillingCycle("monthly")}
              variant={billingCycle === "monthly" ? "primary" : "outline"}
              className="mr-2"
            />
            <Button
              title="Yearly"
              onPress={() => setBillingCycle("yearly")}
              variant={billingCycle === "yearly" ? "primary" : "outline"}
            />
          </View>
        </View>
        <Button
          title={editingSub ? "Update" : "Add"}
          onPress={handleSave}
          loading={loading}
        />
      </Modal>
    </View>
  );
}
