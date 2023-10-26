import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-stack-auth-528e0.firebaseapp.com",
    projectId: "mern-stack-auth-528e0",
    storageBucket: "mern-stack-auth-528e0.appspot.com",
    messagingSenderId: "945760556001",
    appId: "1:945760556001:web:83efd7857c99e5c9b578a0"
};

export const app = initializeApp(firebaseConfig);