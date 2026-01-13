import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import useWaterStore from "@/src/store/waterStore";
import { getCurrentUser, signInAnon, onAuthChange } from "@/src/services/auth";
import WaterGoalCard from "@/src/components/Water/WaterGoalCard";
import Card from "@/src/components/Shared/Card";
import Button from "@/src/components/Shared/Button";
import Input from "@/src/components/Shared/Input";
import Modal from "@/src/components/Shared/Modal";

export default function WaterScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  const { dailyGoal, init, cleanup, setDailyGoal, getTodayIntake, getProgress, loading } = useWaterStore();

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

  const handleSetGoal = async () => {
    const goal = parseFloat(newGoal);
    if (goal > 0) {
      await setDailyGoal(goal);
      setGoalModalVisible(false);
      setNewGoal("");
    }
  };

  const todayIntake = getTodayIntake();
  const progress = getProgress();

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Water Intake
          </Text>
          <Button
            title="Set Goal"
            onPress={() => {
              setNewGoal(dailyGoal.toString());
              setGoalModalVisible(true);
            }}
            variant="outline"
            className="px-4 py-2"
          />
        </View>

        <WaterGoalCard />

        <Card className="mt-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Today's Progress
          </Text>
          <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {todayIntake}ml / {dailyGoal}ml
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {Math.round(progress)}% complete
          </Text>
        </Card>
      </View>

      <Modal
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        title="Set Daily Goal"
      >
        <Input
          label="Daily Goal (ml)"
          value={newGoal}
          onChangeText={setNewGoal}
          placeholder="2000"
          keyboardType="numeric"
        />
        <Button
          title="Save Goal"
          onPress={handleSetGoal}
          loading={loading}
        />
      </Modal>
    </ScrollView>
  );
}
