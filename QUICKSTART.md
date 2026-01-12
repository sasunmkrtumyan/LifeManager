# LifeManager - Quick Start

## 🚀 Run the App

```bash
cd /Users/sasun/Desktop/LifeManager
npx expo start
```

Then press:
- `i` - iOS Simulator
- `a` - Android Emulator
- `w` - Web Browser
- Scan QR code with Expo Go app on your phone

## 📦 What's Included

✅ **React Native + Expo** - Mobile app framework  
✅ **NativeWind** - Tailwind CSS styling  
✅ **React Navigation** - Stack & Tab navigation  
✅ **Zustand** - State management  
✅ **Firebase** - Backend & auth (needs configuration)  
✅ **Push Notifications** - Expo Notifications API  

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── screens/         # App screens (11 screens created)
├── navigation/      # Navigation setup
├── store/          # Zustand stores (habit, task, subscription)
├── services/       # Firebase & notifications
└── utils/          # Helper functions
```

## 🔑 Important Files

- `src/services/firebase.js` - **Configure your Firebase credentials here**
- `src/navigation/AppNavigator.js` - Navigation structure
- `tailwind.config.js` - Tailwind configuration
- `babel.config.js` - NativeWind plugin setup

## ⚡ Quick Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Clear cache
npx expo start -c
```

## 🎯 Next Steps

1. **Configure Firebase** (Required)
   - Update `src/services/firebase.js` with your credentials
   - See SETUP.md for detailed instructions

2. **Start Building**
   - Screens are in `src/screens/`
   - Add components to `src/components/`
   - Use Tailwind classes with NativeWind

3. **Use State Management**
   ```jsx
   import useHabitStore from './store/habitStore';
   
   const { habits, addHabit } = useHabitStore();
   ```

## 📱 Features Ready to Build

- 📅 Calendar
- 📝 Notes
- ✅ Habit Tracker
- 💳 Subscription Manager
- ☑️ Task Manager
- 💰 Budget Tracker
- 💧 Water Tracker
- 💊 Medicine Reminder
- 🤔 Daily Question
- 👤 Profile

## 💡 Styling with NativeWind

```jsx
<View className="flex-1 bg-white p-4">
  <Text className="text-2xl font-bold text-blue-500">
    Hello LifeManager!
  </Text>
  <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mt-4">
    <Text className="text-white text-center font-semibold">
      Click Me
    </Text>
  </TouchableOpacity>
</View>
```

## 📖 Documentation

- `README.md` - Project overview
- `SETUP.md` - Detailed setup instructions
- `QUICKSTART.md` - This file (quick reference)

## 🆘 Help

**App won't start?**
```bash
npx expo start -c
```

**Dependency issues?**
```bash
rm -rf node_modules && npm install
```

**Need Firebase help?**
Check SETUP.md section "Firebase Configuration"

---

**Ready to code?** Run `npx expo start` and let's build! 🎉
