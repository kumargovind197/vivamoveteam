
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
} from "firebase/auth";
import type { User } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase config object goes here.
  // This will be populated automatically when you connect to a Firebase project.
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');

export { 
    auth, 
    provider
};
export type { User };
