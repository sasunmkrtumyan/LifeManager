import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800">
            Welcome to LifeManager
          </Text>
          <Text className="text-gray-600 mt-2">
            Organize your life, one habit at a time
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row flex-wrap mb-6">
          <View className="bg-white rounded-lg p-4 m-1 flex-1 min-w-[45%] shadow-sm">
            <Text className="text-2xl font-bold text-blue-600">0</Text>
            <Text className="text-gray-600 mt-1">Active Habits</Text>
          </View>
          <View className="bg-white rounded-lg p-4 m-1 flex-1 min-w-[45%] shadow-sm">
            <Text className="text-2xl font-bold text-green-600">0</Text>
            <Text className="text-gray-600 mt-1">Tasks Today</Text>
          </View>
          <View className="bg-white rounded-lg p-4 m-1 flex-1 min-w-[45%] shadow-sm">
            <Text className="text-2xl font-bold text-purple-600">0</Text>
            <Text className="text-gray-600 mt-1">Subscriptions</Text>
          </View>
          <View className="bg-white rounded-lg p-4 m-1 flex-1 min-w-[45%] shadow-sm">
            <Text className="text-2xl font-bold text-orange-600">0</Text>
            <Text className="text-gray-600 mt-1">Notes</Text>
          </View>
        </View>

        {/* Feature Cards */}
        <Text className="text-xl font-bold text-gray-800 mb-3">Features</Text>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            ✅ Habit Tracker
          </Text>
          <Text className="text-gray-600 mt-1">
            Build and maintain daily habits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            ☑️ Task Manager
          </Text>
          <Text className="text-gray-600 mt-1">Organize your to-do list</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            💳 Subscriptions
          </Text>
          <Text className="text-gray-600 mt-1">Track recurring payments</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-red-800">
            📅 Calendar
          </Text>
          <Text className="text-gray-600 mt-1">Manage your schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            💰 Budget Tracker
          </Text>
          <Text className="text-gray-600 mt-1">Monitor your expenses</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            💧 Water Tracker
          </Text>
          <Text className="text-gray-600 mt-1">Stay hydrated daily</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">
            💊 Medicine Reminder
          </Text>
          <Text className="text-gray-600 mt-1">
            Never miss your medications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-lg p-5 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800">📝 Notes</Text>
          <Text className="text-gray-600 mt-1">Quick note-taking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
