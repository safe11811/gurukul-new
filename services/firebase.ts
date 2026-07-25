import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3Q8HOYbkuh-BA6bdlOxifP3iioUToS6A",
  authDomain: "lumina-learn-safe.firebaseapp.com",
  projectId: "lumina-learn-safe",
  storageBucket: "lumina-learn-safe.appspot.com",
  messagingSenderId: "578700933652",
  appId: "1:578700933652:web:d1c94596df52de83944501",
  measurementId: "G-KN0EZ54KNF"
};

let app;
let auth: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase initialization failed:", e);
}

export { auth };
