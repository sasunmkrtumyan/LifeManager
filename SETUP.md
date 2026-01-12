# LifeManager Setup Guide

## ✅ Completed Setup

Your LifeManager app has been created with the following configurations:

### Installed Dependencies
- ✅ React Native + Expo
- ✅ NativeWind (Tailwind CSS for React Native)
- ✅ React Navigation (Stack + Bottom Tabs)
- ✅ Zustand (State Management)
- ✅ Firebase SDK
- ✅ Expo Notifications
- ✅ React Native Reanimated
- ✅ React Native Safe Area Context

### Created Structure
```
LifeManager/
├── src/
│   ├── components/
│   │   ├── Calendar/
│   │   ├── Notes/
│   │   ├── Habit/
│   │   ├── Subscription/
│   │   ├── Tasks/
│   │   ├── Budget/
│   │   ├── WaterTracker/
│   │   ├── Medicine/
│   │   └── DailyQuestion/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── HabitScreen.js
│   │   ├── SubscriptionScreen.js
│   │   ├── TaskScreen.js
│   │   ├── NotesScreen.js
│   │   ├── CalendarScreen.js
│   │   ├── BudgetScreen.js
│   │   ├── WaterScreen.js
│   │   ├── MedicineScreen.js
│   │   ├── DailyQuestionScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── store/
│   │   ├── habitStore.js
│   │   ├── taskStore.js
│   │   └── subscriptionStore.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── notifications.js
│   └── utils/
│       └── helpers.js
├── app/
│   └── _layout.tsx (updated with NativeWind)
├── tailwind.config.js
├── babel.config.js
└── global.css
```

## 🔧 Next Steps

### 1. Firebase Configuration (Required)

You need to configure Firebase to use authentication, database, and notifications:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Add an iOS and/or Android app to your Firebase project
4. Download the configuration file
5. Update `src/services/firebase.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Enable Firebase Services

In your Firebase Console:

#### Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password" authentication

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in test mode (change to production rules later)
4. Create these collections:
   - `users`
   - `habits`
   - `tasks`
   - `subscriptions`
   - `notes`
   - `budget`
   - `water`
   - `medicine`
   - `calendar`
   - `dailyQuestions`

#### Cloud Messaging
1. Go to Cloud Messaging
2. Configure FCM for push notifications
3. Add your app's bundle identifier (iOS) or package name (Android)

### 3. Running the App

Start the development server:
```bash
cd /Users/sasun/Desktop/LifeManager
npx expo start
```

Then:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app for physical device

### 4. NativeWind Configuration

NativeWind is already configured! You can use Tailwind classes in your components:

```jsx
<View className="flex-1 bg-white p-4">
  <Text className="text-2xl font-bold text-blue-500">Hello</Text>
</View>
```

### 5. State Management with Zustand

Three stores are already set up:

**Habit Store** (`src/store/habitStore.js`):
- `addHabit(habit)`
- `updateHabit(id, updatedHabit)`
- `deleteHabit(id)`
- `toggleHabitCompletion(id, date)`

**Task Store** (`src/store/taskStore.js`):
- `addTask(task)`
- `updateTask(id, updatedTask)`
- `deleteTask(id)`
- `toggleTaskCompletion(id)`

**Subscription Store** (`src/store/subscriptionStore.js`):
- `addSubscription(subscription)`
- `updateSubscription(id, updatedSubscription)`
- `deleteSubscription(id)`
- `getTotalMonthlyExpense()`

Usage example:
```jsx
import useHabitStore from '../store/habitStore';

function MyComponent() {
  const { habits, addHabit } = useHabitStore();
  
  const handleAddHabit = () => {
    addHabit({ name: 'Exercise', frequency: 'daily' });
  };
  
  return <View>...</View>;
}
```

### 6. Navigation

The app uses React Navigation with a hybrid stack/tab setup:

**Bottom Tabs** (Main Navigation):
- Home
- Habits
- Tasks
- Calendar
- Profile

**Stack Screens** (Secondary):
- Subscriptions
- Notes
- Budget
- Water
- Medicine
- DailyQuestion

To navigate from a tab screen to a stack screen:
```jsx
navigation.navigate('Subscriptions');
```

### 7. Push Notifications

Notification setup is in `src/services/notifications.js`:

```jsx
import { registerForPushNotificationsAsync, scheduleNotification } from '../services/notifications';

// Register for notifications
const token = await registerForPushNotificationsAsync();

// Schedule a notification
await scheduleNotification(
  'Reminder',
  'Time to take your medicine!',
  { seconds: 60 }
);
```

### 8. Helper Utilities

Common utilities are in `src/utils/helpers.js`:
- `formatDate(date)` - Format date strings
- `formatTime(date)` - Format time strings
- `getDaysInMonth(month, year)` - Get days in a month
- `calculateStreak(completedDates)` - Calculate habit streaks

## 📱 Building Components

Create reusable components in the appropriate folder under `src/components/`.

Example component:
```jsx
// src/components/Habit/HabitCard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HabitCard({ habit, onPress }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white p-4 rounded-lg shadow-md mb-3"
    >
      <Text className="text-xl font-semibold">{habit.name}</Text>
      <Text className="text-gray-600">{habit.frequency}</Text>
    </TouchableOpacity>
  );
}
```

## 🔐 Adding Authentication

To add user authentication:

1. Create auth screens (Login, Signup)
2. Use Firebase Auth in `src/services/firebase.js`:

```jsx
import { auth } from './services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Sign up
const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign in
const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
```

## 🎨 Styling Tips

NativeWind supports most Tailwind classes:
- Flexbox: `flex`, `flex-row`, `flex-col`, `justify-center`, `items-center`
- Spacing: `p-4`, `m-2`, `mx-auto`, `px-6`
- Colors: `bg-blue-500`, `text-white`, `border-gray-300`
- Typography: `text-xl`, `font-bold`, `text-center`
- Layout: `w-full`, `h-screen`, `rounded-lg`, `shadow-md`

## 🚀 Next Development Steps

1. Implement user authentication screens
2. Connect Zustand stores to Firebase Firestore
3. Build out individual feature components
4. Add form inputs and validation
5. Implement push notification scheduling
6. Add data persistence with Firestore
7. Create settings and profile management
8. Test on both iOS and Android

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🐛 Troubleshooting

**Metro bundler issues:**
```bash
npx expo start -c
```

**Dependency issues:**
```bash
rm -rf node_modules
npm install
```

**Clear Expo cache:**
```bash
npx expo start -c
```

## ✨ You're All Set!

Your LifeManager app is ready for development. Start by configuring Firebase, then build out your features one by one. Happy coding! 🎉
