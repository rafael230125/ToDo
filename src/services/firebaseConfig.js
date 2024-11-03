import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMALGV9xvQW59j_n7zyNpyxxAPplkj8rI",
  authDomain: "todo-5aeab.firebaseapp.com",
  projectId: "todo-5aeab",
  storageBucket: "todo-5aeab.firebasestorage.app",
  messagingSenderId: "21259294799",
  appId: "1:21259294799:web:4aee6f628e7c3ffc02723a",
  measurementId: "G-EBXQMPN580"
};

// Inicialize o Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// export const auth = getAuth(app);
const db = getFirestore(app);

export { db };