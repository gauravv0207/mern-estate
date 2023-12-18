// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
//   apiKey: "AIzaSyAGPuLKeWvbEapEPQQ1jNiBwhcXAHcy2cY",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4ba05.firebaseapp.com",
  projectId: "mern-estate-4ba05",
  storageBucket: "mern-estate-4ba05.appspot.com",
  messagingSenderId: "790977017070",
  appId: "1:790977017070:web:ee798325419e48f25befff",
  measurementId: "G-GHP70ZYT0P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); 