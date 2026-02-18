// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ REQUIRED

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgcq9ccq_AzAoUg3BCbxM5Kl-dyRp-G8E",
  authDomain: "excel-clone-demo.firebaseapp.com",
  projectId: "excel-clone-demo",
  storageBucket: "excel-clone-demo.firebasestorage.app",
  messagingSenderId: "893490692218",
  appId: "1:893490692218:web:0f68c8b8cff61a1b10fbc3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
export {auth, googleProvider};