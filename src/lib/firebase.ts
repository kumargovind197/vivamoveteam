import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,GoogleAuthProvider } from "firebase/auth";

// This is a placeholder for your Firebase configuration object.
// To connect this app to a Firebase project, you'll need to
// create a project in the Firebase console and get your web app's
// configuration object.
const firebaseConfig = {
 apiKey: "AIzaSyDqlKYJS5TfZhGu1rGG-R4vQBQfVwzzbmI",
  authDomain: "login-c5db7.firebaseapp.com",
  projectId: "login-c5db7",
  storageBucket: "login-c5db7.appspot.com",
  messagingSenderId: "1024817791284",
  appId: "1:1024817791284:web:61d32444e51473656be561",
  measurementId: "G-YMT7SDX8CH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// This scope is requested for the Google Fit API integration.
// provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');
