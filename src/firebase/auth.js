// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your Firebase project configuration (Corrected)
const firebaseConfig = {
  apiKey: "AIzaSyCD12xaGHyVIaAtPkhtQaXIBfrihhcCXtA",
  authDomain: "database-4ca50.firebaseapp.com",
  projectId: "database-4ca50",
  storageBucket: "database-4ca50.appspot.com", // Fixed storageBucket
  messagingSenderId: "558283955268",
  appId: "1:558283955268:web:b1a467efa0af31a811b011",
  measurementId: "G-KXM6608B35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth();
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();
