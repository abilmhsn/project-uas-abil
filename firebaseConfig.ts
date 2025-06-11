import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBN3LC0frU2fonpWZWVzg0r5B_b81CWd9Q",//current_key
    authDomain: "abizel-d876e.firebaseapp.com",//project_id + ".firebaseapp.com"
    projectId: "abizel-d876e", //project_id
    storageBucket: "abizel-d876e.firebasestorage.app", //project_id + ".firebasestorage.googleapis.com"
    messagingSenderId: "485583966556", //project_number
    appId: "1:485583966556:android:5b33436e38ea4c0963f199", //app_id
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Auth
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

export { auth, db }
