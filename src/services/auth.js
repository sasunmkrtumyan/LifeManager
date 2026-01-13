/**
 * Authentication service using Firebase Auth
 */
import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Check if Firebase is configured
if (!auth || !db) {
  console.warn('⚠️ Firebase Auth and Firestore are not available. Please configure Firebase in src/services/firebase.js');
}

/**
 * Sign in anonymously (for quick start)
 */
export const signInAnon = async () => {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Please update src/services/firebase.js with your Firebase credentials.');
  }
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    
    // Create user document if it doesn't exist
    await ensureUserDocument(user.uid);
    
    return user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document
    await ensureUserDocument(user.uid, { email });
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  if (!auth) {
    // Return a no-op unsubscribe function if auth is not configured
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Ensure user document exists in Firestore
 */
const ensureUserDocument = async (userId, additionalData = {}) => {
  if (!db) {
    console.warn('Firestore is not configured. Skipping user document creation.');
    return;
  }
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        createdAt: new Date().toISOString(),
        ...additionalData,
      });
    }
  } catch (error) {
    console.error('Error ensuring user document:', error);
    throw error;
  }
};
