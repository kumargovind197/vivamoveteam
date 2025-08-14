
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
} from "firebase/auth";
import type { User } from 'firebase/auth';

// This is a placeholder for your Firebase configuration object.
// To connect this app to a Firebase project, you'll need to
// create a project in the Firebase console and get your web app's
// configuration object.
const firebaseConfig = {
  // Example:
  // apiKey: "AIza....",
  // authDomain: "your-project-id.firebaseapp.com",
  // projectId: "your-project-id",
  // storageBucket: "your-project-id.appspot.com",
  // messagingSenderId: "...",
  // appId: "1:...",
  // measurementId: "G-..."
};

// Initialize Firebase
// The logic checks if an app is already initialized to prevent errors.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// This scope is requested for the Google Fit API integration.
provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');

export { 
    auth, 
    provider
};
export type { User };
