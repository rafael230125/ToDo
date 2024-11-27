import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChh3kLFcckM2LKHW4Hq61B9LyKDvYx1Fg",
  authDomain: "app-todo-e9523.firebaseapp.com",
  projectId: "app-todo-e9523",
  storageBucket: "app-todo-e9523.firebasestorage.app",
  messagingSenderId: "931536232528",
  appId: "1:931536232528:web:701abcacbae149d4253155"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});