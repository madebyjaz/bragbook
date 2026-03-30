// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Initialize and retrieve the Firebase Auth service instance 
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDoRfwPYRg7YrB7szHGZ2Dl7PF7Yp_1rQ",
  authDomain: "bragbook-592cd.firebaseapp.com",
  projectId: "bragbook-592cd",
  storageBucket: "bragbook-592cd.firebasestorage.app",
  messagingSenderId: "881264987910",
  appId: "1:881264987910:web:c8568dd431b2963e3b5887",
  measurementId: "G-CLD6ZDJ1DB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth instance for use in login and signup components
export const auth = getAuth(app)
