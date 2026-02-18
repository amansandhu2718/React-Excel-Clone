// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ REQUIRED

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyBsJOWq_tR5dPpEGfsqRqjVIT1GdEssQ-g",
  authDomain: "excel-learning-demo.firebaseapp.com",
  projectId: "excel-learning-demo",
  storageBucket: "excel-learning-demo.firebasestorage.app",
  messagingSenderId: "215101485456",
  appId: "1:215101485456:web:8a68e1863e491941018315"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
export {auth, googleProvider};