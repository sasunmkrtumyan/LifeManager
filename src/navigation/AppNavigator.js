import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import BudgetScreen from "../screens/BudgetScreen";
import CalendarScreen from "../screens/CalendarScreen";
import DailyQuestionScreen from "../screens/DailyQuestionScreen";
import HabitScreen from "../screens/HabitScreen";
import HomeScreen from "../screens/HomeScreen";
import MedicineScreen from "../screens/MedicineScreen";
import NotesScreen from "../screens/NotesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import TaskScreen from "../screens/TaskScreen";
import WaterScreen from "../screens/WaterScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Habits" component={HabitScreen} />
      <Tab.Screen name="Tasks" component={TaskScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Subscriptions" component={SubscriptionScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="Budget" component={BudgetScreen} />
        <Stack.Screen name="Water" component={WaterScreen} />
        <Stack.Screen name="Medicine" component={MedicineScreen} />
        <Stack.Screen name="DailyQuestion" component={DailyQuestionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
