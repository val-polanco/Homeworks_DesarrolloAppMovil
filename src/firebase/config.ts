import { initializeApp } from "firebase/app";

import {
  getAuth
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";

import {
  getDatabase
} from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBlCrOpx8WBobMPGjRbgIU4vjRk-HPrC24",
  authDomain: "challenge05-valeria.firebaseapp.com",
  projectId: "challenge05-valeria",
  storageBucket: "challenge05-valeria.firebasestorage.app",
  messagingSenderId: "269979326956",
  appId: "1:269979326956:web:239199a16bc762587388c9",
  measurementId: "G-T69V5BZMNX",

  databaseURL:
    "https://challenge05-valeria-default-rtdb.firebaseio.com"
};


const app =
  initializeApp(firebaseConfig);


export const auth =
  getAuth(app);


export const db =
  getFirestore(app);


export const realtimeDb =
  getDatabase(app);


export default app;