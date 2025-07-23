// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getDatabase } from "firebase/database"; // 👈 Import RTDB

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDyvcGp49Ctb3KSIBEsDX3SgCEJRpYjJXg",
//   authDomain: "tech-blog-50e2a.firebaseapp.com",
//   projectId: "tech-blog-50e2a",
//   storageBucket: "tech-blog-50e2a.firebasestorage.app",
//   messagingSenderId: "675936710451",
//   appId: "1:675936710451:web:6b8fc94cb949dd3ee11846",
//   measurementId: "G-5E7R9962RN"
// };
const firebaseConfig = {
  apiKey: "AIzaSyAZ1GefwSRaOJvhea_3A9zwRIzj1Ih__d0",
  authDomain: "e-learning-601a3.firebaseapp.com",
  databaseURL: "https://e-learning-601a3-default-rtdb.firebaseio.com",
  projectId: "e-learning-601a3",
  storageBucket: "e-learning-601a3.firebasestorage.app",
  messagingSenderId: "140626645924",
  appId: "1:140626645924:web:15c41be3703a223b2c2731",
  measurementId: "G-RBQD7VNWTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;