// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg8MhAvahbKd2HtA1DKw4LdCqKfMyFAzc",
  authDomain: "cardi8.firebaseapp.com",
  projectId: "cardi8",
  storageBucket: "cardi8.appspot.com",
  messagingSenderId: "790889170605",
  appId: "1:790889170605:web:77b4c5d7d2be97d1b3e824",
  measurementId: "G-FS7PF8Q0S7",
};

// Initialize Firebase (

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
const db = firebase.firestore();
export { firebase, authentication, db };
