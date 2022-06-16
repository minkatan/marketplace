// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX5KGofUu8CeaT_SI1btES1WT0Nc01zr8",
  authDomain: "house-app-70b99.firebaseapp.com",
  projectId: "house-app-70b99",
  storageBucket: "house-app-70b99.appspot.com",
  messagingSenderId: "1783728091",
  appId: "1:1783728091:web:f7481742c1dbbc419089fe",
  measurementId: "G-7TLKKPWJ36"
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore()