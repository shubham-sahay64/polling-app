import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7IJAgwKmuuEjVYORZcVURQlVTs48lsb0",
    authDomain: "polling-app-8071b.firebaseapp.com",
    projectId: "polling-app-8071b",
    storageBucket: "polling-app-8071b.appspot.com",
    messagingSenderId: "566699977325",
    appId: "1:566699977325:web:f32b516c228c253768ad64",
    measurementId: "G-34494X5F47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
