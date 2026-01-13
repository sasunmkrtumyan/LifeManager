import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCurrentUser, signOutUser, onAuthChange } from "@/src/services/auth";
import Card from "@/src/components/Shared/Card";
import Button from "@/src/components/Shared/Button";

export default function ProfileScreen() {
  const router = useRouter();
  const { colorScheme, setTheme } = useColorScheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const unsubscribe = onAuthChange((authUser: User | null) => {
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Profile
        </Text>

        {/* User Info */}
        <Card className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Account
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {user?.email || 'Anonymous User'}
          </Text>
          {user?.uid && (
            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              ID: {user.uid.substring(0, 8)}...
            </Text>
          )}
        </Card>

        {/* Settings */}
        <Card className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Settings
          </Text>

          {/* Theme Toggle */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                Theme
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: '#767577', true: '#2563eb' }}
              thumbColor={colorScheme === 'dark' ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </Card>

        {/* Quick Links */}
        <Card className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Features
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/habits')}
            className="py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <Text className="text-base text-gray-900 dark:text-gray-100">Habits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/subscription')}
            className="py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <Text className="text-base text-gray-900 dark:text-gray-100">Subscriptions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/budget')}
            className="py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <Text className="text-base text-gray-900 dark:text-gray-100">Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/water')}
            className="py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <Text className="text-base text-gray-900 dark:text-gray-100">Water Intake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/medicine')}
            className="py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <Text className="text-base text-gray-900 dark:text-gray-100">Medicine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/daily-question')}
            className="py-3"
          >
            <Text className="text-base text-gray-900 dark:text-gray-100">Daily Question</Text>
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          className="mt-4"
        />
      </View>
    </ScrollView>
  );
}
