// Firebase core
import { initializeApp } from "firebase/app";

// 🔥 Import Auth (IMPORTANT)
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA-DWa6Ah4mQZcAkoohNNQg2YZKNBcYRFc",
  authDomain: "service-web-munazir.firebaseapp.com",
  projectId: "service-web-munazir",
  storageBucket: "service-web-munazir.firebasestorage.app",
  messagingSenderId: "774728230619",
  appId: "1:774728230619:web:11d2c0b10fd4589903cefe",
  measurementId: "G-HMMWTJLZ92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Export auth (VERY IMPORTANT)
export const auth = getAuth(app);
