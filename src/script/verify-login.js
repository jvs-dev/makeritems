import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyAUxjEyxLmJnG0oU1AJsYnLIYEFObdn5QU",
    authDomain: "makeritems.firebaseapp.com",
    projectId: "makeritems",
    storageBucket: "makeritems.appspot.com",
    messagingSenderId: "1015331642391",
    appId: "1:1015331642391:web:532c700db2f2f3a1fd1052"
};
const app = initializeApp(firebaseConfig);
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, sendPasswordResetEmail, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp, deleteField } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

function loadData() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
        } else {
            let body = document.querySelector("body")
            body.innerHTML=""
            window.location.href="login.html"
        }
    });
}

loadData()