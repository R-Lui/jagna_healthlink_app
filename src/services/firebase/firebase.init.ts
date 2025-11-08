/**
 * Firebase Initialization
 * Sets up Firebase app with configuration
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../../../config/firebase.config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

/**
 * Initialize Firebase services
 * Safe to call multiple times - will reuse existing instance
 */
export function initializeFirebase() {
  try {
    console.log('🔧 Starting Firebase initialization...');
    
    // Initialize app (or get existing)
    if (getApps().length === 0) {
      console.log('📱 Creating new Firebase app...');
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized');
    } else {
      console.log('📱 Using existing Firebase app...');
      app = getApp();
      console.log('✅ Firebase app already initialized');
    }

    // Initialize Auth with AsyncStorage persistence
    if (!auth) {
      console.log('🔐 Initializing Auth with React Native persistence...');
      
      try {
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
        console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
      } catch (authError) {
        console.error('❌ Auth initialization failed:', authError);
        console.error('❌ Auth error stack:', authError instanceof Error ? authError.stack : 'No stack trace');
        throw authError;
      }
    } else {
      console.log('🔐 Auth already initialized');
    }

    // Initialize Firestore with offline persistence
    if (!firestore) {
      firestore = initializeFirestore(app, {
        cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
      });
      console.log('✅ Firestore initialized with offline persistence');
    }

    // Initialize Storage
    storage = getStorage(app);
    console.log('✅ Firebase Storage initialized');

    return { app, auth, firestore, storage };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    const services = initializeFirebase();
    auth = services.auth;
  }
  return auth;
}

/**
 * Get Firestore instance
 */
export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    const services = initializeFirebase();
    firestore = services.firestore;
  }
  return firestore;
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    const services = initializeFirebase();
    storage = services.storage;
  }
  return storage;
}
