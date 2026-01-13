import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import useBudgetStore from "@/src/store/budgetStore";
import { getCurrentUser, signInAnon, onAuthChange } from "@/src/services/auth";
import Card from "@/src/components/Shared/Card";
import Button from "@/src/components/Shared/Button";
import Input from "@/src/components/Shared/Input";
import Modal from "@/src/components/Shared/Modal";
import { formatDisplayDate } from "@/src/utils/dateHelpers";

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: Date | string;
}

export default function BudgetScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { expenses, init, cleanup, addExpense, updateExpense, deleteExpense, getTotalByPeriod, loading } = useBudgetStore();

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
    if (!amount) return;

    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, {
          amount: parseFloat(amount),
          category,
          description,
          date: new Date(date),
        });
      } else {
        await addExpense({
          amount: parseFloat(amount),
          category,
          description,
          date: new Date(date),
        });
      }
      setModalVisible(false);
      setAmount("");
      setCategory("Other");
      setDescription("");
      setDate(new Date().toISOString().split('T')[0]);
      setEditingExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDescription(expense.description || "");
    setDate(expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setModalVisible(true);
  };

  const thisMonthTotal = getTotalByPeriod(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date()
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Budget
          </Text>
          <Button
            title="+ Add"
            onPress={() => setModalVisible(true)}
            className="px-4 py-2"
          />
        </View>

        <Card className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            This Month's Total
          </Text>
          <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${thisMonthTotal.toFixed(2)}
          </Text>
        </Card>

        <ScrollView>
          {expenses.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                No expenses yet. Add your first expense!
              </Text>
            </View>
          ) : (
            expenses.map((expense: Expense) => (
              <Card key={expense.id} className="mb-3">
                <TouchableOpacity onPress={() => handleEdit(expense)}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ${expense.amount.toFixed(2)}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {expense.category}
                      </Text>
                      {expense.description && (
                        <Text className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {expense.description}
                        </Text>
                      )}
                      <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDisplayDate(expense.date)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteExpense(expense.id)}
                    >
                      <Text className="text-red-600 dark:text-red-400 text-sm">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Card>
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingExpense(null);
          setAmount("");
          setCategory("Other");
          setDescription("");
          setDate(new Date().toISOString().split('T')[0]);
        }}
        title={editingExpense ? "Edit Expense" : "Add Expense"}
      >
        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
        />
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </Text>
          <View className="flex-row flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                title={cat}
                onPress={() => setCategory(cat)}
                variant={category === cat ? "primary" : "outline"}
                className="mr-2 mb-2"
              />
            ))}
          </View>
        </View>
        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add description..."
        />
        <Input
          label="Date"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
        <Button
          title={editingExpense ? "Update" : "Add"}
          onPress={handleSave}
          loading={loading}
        />
      </Modal>
    </View>
  );
}
