# LifeManager

A comprehensive life management app built with React Native and Expo.

## Tech Stack

### Frontend
- **React Native + Expo** - Cross-platform mobile framework
- **React Navigation** - Stack and tab navigation
- **Zustand** - State management
- **NativeWind** - Tailwind CSS for React Native

### Backend / Storage
- **Firebase Auth** - User authentication (login/signup)
- **Firestore** - NoSQL database for data storage
- **Cloud Functions** - Backend logic and scheduled tasks
- **Cloud Messaging** - Push notifications

### Push Notifications
- **Firebase Cloud Messaging** - Cross-platform notifications
- **Expo Notifications API** - Local and push notifications

## Features

- 📅 **Calendar** - Manage your schedule and events
- 📝 **Notes** - Quick note-taking
- ✅ **Habit Tracker** - Build and maintain habits with streak tracking
- 💳 **Subscription Manager** - Track recurring subscriptions
- ☑️ **Task Manager** - Todo list with completion tracking
- 💰 **Budget Tracker** - Monitor expenses and budget
- 💧 **Water Tracker** - Daily hydration monitoring
- 💊 **Medicine Reminder** - Never miss your medications
- 🤔 **Daily Question** - Daily reflection prompts
- 👤 **Profile** - User settings and preferences

## Project Structure

```
/src
  /components          # Reusable UI components
    /Calendar
    /Notes
    /Habit
    /Subscription
    /Tasks
    /Budget
    /WaterTracker
    /Medicine
    /DailyQuestion
  /screens            # App screens
  /navigation         # Navigation configuration
  /store             # Zustand state stores
  /services          # External service integrations
  /utils            # Helper functions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Cloud Messaging
   - Download your Firebase config
   - Update `src/services/firebase.js` with your Firebase credentials

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Firebase Setup

1. **Authentication**: Enable Email/Password authentication in Firebase Console
2. **Firestore**: Create collections for users, habits, tasks, subscriptions, notes, budget, water, medicine
3. **Cloud Messaging**: Configure FCM for push notifications

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

### State Management

The app uses Zustand for state management. Store files are located in `/src/store/`

## License

This project is licensed under the MIT License.
