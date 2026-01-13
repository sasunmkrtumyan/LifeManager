import Card from "@/src/components/Shared/Card";
import WaterGoalCard from "@/src/components/Water/WaterGoalCard";
import { getCurrentUser, onAuthChange, signInAnon } from "@/src/services/auth";
import { registerForPushNotificationsAsync } from "@/src/services/notifications";
import useHabitStore from "@/src/store/habitStore";
import useNoteStore from "@/src/store/noteStore";
import useSubscriptionStore from "@/src/store/subscriptionStore";
import useTaskStore from "@/src/store/taskStore";
import useWaterStore from "@/src/store/waterStore";
import { formatDate, getToday } from "@/src/utils/dateHelpers";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  const { habits, init: initHabits, cleanup: cleanupHabits } = useHabitStore();
  const {
    tasks,
    init: initTasks,
    cleanup: cleanupTasks,
    getOverdueTasks,
  } = useTaskStore();
  const {
    subscriptions,
    init: initSubscriptions,
    cleanup: cleanupSubscriptions,
    getTotalMonthlyExpense,
  } = useSubscriptionStore();
  const { notes, init: initNotes, cleanup: cleanupNotes } = useNoteStore();
  const { init: initWater, cleanup: cleanupWater } = useWaterStore();

  useEffect(() => {
    // Initialize auth and data
    const initialize = async () => {
      try {
        // Request notification permissions
        await registerForPushNotificationsAsync();

        // Check if Firebase is configured
        const currentUser = getCurrentUser();

        if (!currentUser) {
          try {
            // Try to sign in anonymously if Firebase is configured
            const newUser = await signInAnon();
            setUser(newUser);

            // Initialize all stores
            if (newUser) {
              initHabits(newUser.uid);
              initTasks(newUser.uid);
              initSubscriptions(newUser.uid);
              initNotes(newUser.uid);
              initWater(newUser.uid);
            }
          } catch (authError: unknown) {
            // If Firebase is not configured, show a warning but continue
            const errorMessage =
              authError instanceof Error
                ? authError.message
                : String(authError);
            if (
              errorMessage.includes("Firebase") ||
              errorMessage.includes("not configured")
            ) {
              console.warn(
                "⚠️ Firebase not configured. App will work in offline mode."
              );
              console.warn(
                "Please update src/services/firebase.js with your Firebase credentials to enable cloud sync."
              );
            } else {
              throw authError;
            }
          }
        } else {
          setUser(currentUser);
          // Initialize all stores
          if (currentUser) {
            initHabits(currentUser.uid);
            initTasks(currentUser.uid);
            initSubscriptions(currentUser.uid);
            initNotes(currentUser.uid);
            initWater(currentUser.uid);
          }
        }

        setInitialized(true);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error initializing:", errorMessage);
        // Still set initialized to true so the app can continue
        setInitialized(true);
      }
    };

    initialize();

    // Listen for auth changes
    const unsubscribe = onAuthChange((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
        initHabits(authUser.uid);
        initTasks(authUser.uid);
        initSubscriptions(authUser.uid);
        initNotes(authUser.uid);
        initWater(authUser.uid);
      } else {
        setUser(null);
        cleanupHabits();
        cleanupTasks();
        cleanupSubscriptions();
        cleanupNotes();
        cleanupWater();
      }
    });

    return () => {
      unsubscribe();
      cleanupHabits();
      cleanupTasks();
      cleanupSubscriptions();
      cleanupNotes();
      cleanupWater();
    };
  }, []);

  const today = getToday();
  const activeHabits = habits.filter(
    (h: { completedDates?: string[] }) =>
      !h.completedDates ||
      h.completedDates.length === 0 ||
      (today && !h.completedDates.includes(today))
  );
  const todayTasks = tasks.filter(
    (t: { completed: boolean; dueDate?: Date | string | null }) =>
      !t.completed && t.dueDate && formatDate(t.dueDate) === getToday()
  );
  const overdueTasks = getOverdueTasks();
  const monthlyTotal = getTotalMonthlyExpense();

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-gray-600 dark:text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to LifeManager
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-2">
            Organize your life, one habit at a time
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row flex-wrap mb-6">
          <Card className="p-4 m-1 flex-1 min-w-[45%]">
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {habits.length}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-1">
              Active Habits
            </Text>
          </Card>
          <Card className="p-4 m-1 flex-1 min-w-[45%]">
            <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
              {todayTasks.length}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-1">
              Tasks Today
            </Text>
          </Card>
          <Card className="p-4 m-1 flex-1 min-w-[45%]">
            <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {subscriptions.length}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-1">
              Subscriptions
            </Text>
          </Card>
          <Card className="p-4 m-1 flex-1 min-w-[45%]">
            <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {notes.length}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mt-1">Notes</Text>
          </Card>
        </View>

        {/* Water Intake */}
        <WaterGoalCard />

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <Card className="mb-4 border-l-4 border-red-500">
            <Text className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
              ⚠️ {overdueTasks.length} Overdue Task
              {overdueTasks.length > 1 ? "s" : ""}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/tasks")}>
              <Text className="text-blue-600 dark:text-blue-400">
                View Tasks →
              </Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Monthly Subscription Total */}
        {subscriptions.length > 0 && (
          <Card className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Monthly Subscriptions Total
            </Text>
            <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${monthlyTotal.toFixed(2)}
            </Text>
          </Card>
        )}

        {/* Quick Actions */}
        <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Quick Actions
        </Text>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/habits")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            ✅ Habit Tracker
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Build and maintain daily habits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/(tabs)/tasks")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            ☑️ Task Manager
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your to-do list
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/subscription")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            💳 Subscriptions
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Track recurring payments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/(tabs)/calendar")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            📅 Calendar
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/budget")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            💰 Budget Tracker
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/water")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            💧 Water Tracker
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Stay hydrated daily
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/medicine")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            💊 Medicine Reminder
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Never miss your medications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-3 shadow-sm"
          onPress={() => router.push("/(tabs)/notes")}
        >
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            📝 Notes
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-1">
            Quick note-taking
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
