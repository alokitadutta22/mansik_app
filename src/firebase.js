import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHWzx5ewC9rD-Taqb92ZDicFk6s7lPws4",
  authDomain: "project-8e0a0.firebaseapp.com",
  projectId: "project-8e0a0",
  storageBucket: "project-8e0a0.firebasestorage.app",
  messagingSenderId: "656595317133",
  appId: "1:656595317133:web:7923f6dccf5acfa0e94dc4",
  measurementId: "G-1F4GEVRETW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
