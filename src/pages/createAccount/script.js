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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
let createAccountBtn = document.getElementById("createAccountBtn")
let copyDataSection = document.getElementById("copyDataSection")
let closeCopyData = document.getElementById("closeCopyData")
let alertTxt = document.getElementById("alertTxt")

closeCopyData.onclick = () => {
    copyDataSection.style.opacity = "0"
    let password = document.getElementById("password")
    let confirmPassword = document.getElementById("confirmPassword")
    let email = document.getElementById("email")
    password.value = ""
    confirmPassword.value = ""
    email.value = ""
    setTimeout(() => {
        copyDataSection.style.display = "none"
    }, 200);
}

createAccountBtn.onclick = () => {
    let password = document.getElementById("password").value.toLowerCase()
    let confirmPassword = document.getElementById("confirmPassword").value.toLowerCase()
    let email = document.getElementById("email").value.toLowerCase()
    if (password != "" && confirmPassword != "" && email != "") {
        if (password == confirmPassword) {
            verifyAccount(email, password)
        } else {
            alertTxt.textContent = "As senhas não correspondem"
            setTimeout(() => {
                alertTxt.textContent = ""
            }, 5000);
        }
    } else {
        alertTxt.textContent = "Preencha todos os campos"
        setTimeout(() => {
            alertTxt.textContent = ""
        }, 5000);
    }
}

async function verifyAccount(email, password) {
    let docRef = doc(db, "users", `${email}`);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        alertTxt.textContent = "Esta conta já existe"
        setTimeout(() => {
            alertTxt.textContent = ""
        }, 5000);
    } else {
        createAccount(email, password)
    }
}

async function createAccount(email, password) {
    await setDoc(doc(db, "users", `${email}`), {
        email: `${email}`,
        temporaryPassword: `${password}`
    });
    let viewPassword = document.getElementById("viewPassword")
    let viewEmail = document.getElementById("viewEmail")
    viewEmail.innerHTML = `Email: ${email}`
    viewPassword.innerHTML = `Senha: ${password}`
    copyDataSection.style.display = "flex"
    setTimeout(() => {
        copyDataSection.style.opacity = "1"
    }, 1);
}