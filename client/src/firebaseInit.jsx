// import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';
import { getFirestore, collection  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import the 'getAuth' function from the 'firebase/auth' module


import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyBvJgzEYn4LliRAWdxzLcU4waHQisC-RUY",
  authDomain: "chat-application-65da5.firebaseapp.com",
  projectId: "chat-application-65da5",
  storageBucket: "chat-application-65da5.appspot.com",
  messagingSenderId: "537930933293",
  appId: "1:537930933293:web:cd880a3a92031e00d404a4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app);


export { db, collection, auth };