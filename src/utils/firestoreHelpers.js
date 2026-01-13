/**
 * Reusable Firestore CRUD helper functions
 */
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Check if Firestore is configured
if (!db) {
  console.warn('⚠️ Firestore is not configured. Firestore operations will fail.');
  console.warn('Please update src/services/firebase.js with your Firebase credentials.');
}

/**
 * Generic function to add a document to a collection
 */
export const addDocument = async (collectionPath, data) => {
  if (!db) {
    throw new Error('Firestore is not configured. Please update src/services/firebase.js with your Firebase credentials.');
  }
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

/**
 * Generic function to update a document
 */
export const updateDocument = async (collectionPath, docId, data) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Generic function to delete a document
 */
export const deleteDocument = async (collectionPath, docId) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Generic function to get a single document
 */
export const getDocument = async (collectionPath, docId) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

/**
 * Generic function to get all documents from a collection
 */
export const getDocuments = async (collectionPath, filters = [], orderByField = null) => {
  try {
    let q = collection(db, collectionPath);
    
    // Apply filters
    if (filters.length > 0) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField.field, orderByField.direction || 'asc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

/**
 * Generic function to set up a real-time listener
 */
export const subscribeToCollection = (collectionPath, filters = [], orderByField = null, callback) => {
  if (!db) {
    console.warn('Firestore is not configured. Cannot set up listener.');
    // Return empty data and a no-op unsubscribe function
    callback([]);
    return () => {};
  }
  try {
    let q = collection(db, collectionPath);
    
    // Apply filters
    if (filters.length > 0) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField.field, orderByField.direction || 'desc'));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    }, (error) => {
      console.error('Error in snapshot:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up listener:', error);
    return () => {};
  }
};

/**
 * Helper to get user-specific collection path
 */
export const getUserCollectionPath = (userId, subcollection) => {
  return `users/${userId}/${subcollection}`;
};

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

/**
 * Convert JavaScript Date to Firestore Timestamp
 */
export const dateToTimestamp = (date) => {
  if (!date) return null;
  return Timestamp.fromDate(date instanceof Date ? date : new Date(date));
};
