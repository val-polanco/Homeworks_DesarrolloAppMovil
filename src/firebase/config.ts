import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlCrOpx8WBobMPGjRbgIU4vjRk-HPrC24",
  authDomain: "challenge05-valeria.firebaseapp.com",
  projectId: "challenge05-valeria",
  storageBucket: "challenge05-valeria.firebasestorage.app",
  messagingSenderId: "269979326956",
  appId: "1:269979326956:web:239199a16bc762587388c9",
  measurementId: "G-T69V5BZMNX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;