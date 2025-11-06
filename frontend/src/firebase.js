import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDhRnpQBJ1IbvhuN0hU5iQAHIp3k84iW9U",
  authDomain: "bjmp-55cd6.firebaseapp.com",
  projectId: "bjmp-55cd6",
  storageBucket: "bjmp-55cd6.firebasestorage.app",
  messagingSenderId: "211381541623",
  appId: "1:211381541623:web:bcb965a96c365f096e11f2",
  measurementId: "G-P3L2W5WTQT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider, signInWithPopup };
