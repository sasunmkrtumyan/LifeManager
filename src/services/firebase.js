import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 * 
 * Replace the placeholder values below with your actual Firebase project credentials.
 * You can find these in your Firebase Console under Project Settings > General > Your apps.
 * 
 * To get your Firebase config:
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Select your project (or create a new one)
 * 3. Click the gear icon > Project Settings
 * 4. Scroll down to "Your apps" section
 * 5. If you haven't added a web app, click "Add app" and select Web
 * 6. Copy the config values from the firebaseConfig object
 */
const firebaseConfig = {
  apiKey: "AIzaSyC7ZsLs2AP-drtE4yg4B4NBsayv8GZ5690",
  authDomain: "lifemanager-d976b.firebaseapp.com",
  projectId: "lifemanager-d976b",
  storageBucket: "lifemanager-d976b.firebasestorage.app",
  messagingSenderId: "363077813616",
  appId: "1:363077813616:web:bb2be23248eb4e4c093bb5",
  measurementId: "G-PYXP8BXJE0"
};

// Check if Firebase config is valid (not placeholder values)
const isFirebaseConfigured = 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "YOUR_PROJECT_ID" &&
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY";

let app = null;
let auth = null;
let db = null;

// Initialize Firebase only if config is valid
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization error:', error);
    console.warn('Please update src/services/firebase.js with your Firebase credentials');
  }
} else {
  console.warn('⚠️ Firebase not configured. Please update src/services/firebase.js with your Firebase credentials.');
  console.warn('The app will work in offline mode, but data will not be synced to Firebase.');
}

// Export Firebase services (will be null if not configured)
export { auth, db };

// Note: getMessaging is for web only. For React Native, use Expo Notifications instead.
// We're using expo-notifications for push notifications in this app.

// Export app instance (will be null if not configured)
export default app;
