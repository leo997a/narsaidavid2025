
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// تكوين Firebase (استبدل هذه القيم بقيم مشروعك الخاص)
const firebaseConfig = {
  apiKey: "AIzaSyB9HEI-VwECffA8fEKv9xylSMuW_DaYHhY",
  authDomain: "narsaidavid2025.firebaseapp.com",
  databaseURL: "https://narsaidavid2025-default-rtdb.firebaseio.com",
  projectId: "narsaidavid2025",
  storageBucket: "narsaidavid2025.appspot.com",
  messagingSenderId: "342242431485",
  appId: "1:342242431485:web:a37f91a5b0aa5adf8b2cb1"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// الحصول على قاعدة البيانات
export const database = getDatabase(app);
