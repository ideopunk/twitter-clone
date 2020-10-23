import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDz3aiASC8v6x9SpC_3TpBvzkmqqYWyv7g",
	authDomain: "twitter-clone-12cf9.firebaseapp.com",
	databaseURL: "https://twitter-clone-12cf9.firebaseio.com",
	projectId: "twitter-clone-12cf9",
	storageBucket: "twitter-clone-12cf9.appspot.com",
	messagingSenderId: "1050077543810",
	appId: "1:1050077543810:web:12b8d4ea1aab1a3a74239b",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
