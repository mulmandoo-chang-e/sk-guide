import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdT9LU3dfsbLRsTeUg2BORxVObbxb12l4",
  authDomain: "sk-guide.firebaseapp.com",
  databaseURL: "https://sk-guide-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sk-guide",
  storageBucket: "sk-guide.firebasestorage.app",
  messagingSenderId: "295392190950",
  appId: "1:295392190950:web:807b19af04efd8fe10f627",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage = getStorage(app);