import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAd4nUSyth9-2yiyDozmq1rr7Otv4_cG5U",
  authDomain: "todoapp-d2a96.firebaseapp.com",
  projectId: "todoapp-d2a96",
  storageBucket: "todoapp-d2a96.appspot.com",
  messagingSenderId: "954560467812",
  appId: "1:954560467812:web:f263270ac7ebc670e3e071",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
