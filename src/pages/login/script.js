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
let loginBtn = document.getElementById("loginBtn")
let alertTxt = document.getElementById("alertTxt")
let resetEmail = document.getElementById("resetEmail")

loginBtn.onclick = () => {
    loginBtn.innerHTML = `<div class="loader"></div>`
    loginBtn.classList.add("loading")
    let passwordInput = document.getElementById("passwordInput").value
    let emailInput = document.getElementById("emailInput").value
    if (emailInput != "" && passwordInput != "") {
        login(emailInput, passwordInput)
    } else {
        alertTxt.style.color = "#f00"
        alertTxt.innerHTML = "Preencha todos os campos para continuar"
        loginBtn.innerHTML = `ENTRAR`
        loginBtn.classList.remove("loading")
        setTimeout(() => {
            alertTxt.innerHTML = ""
        }, 5000);
    }
}

function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = "index.html"
        })
        .catch((error) => {
            verifyAccount(email, password)
        });
}


async function verifyAccount(email, password) {
    let docRef = doc(db, "users", `${email}`);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().temporaryPassword == password) {
        createNewAccount(email, password)
    } else {
        alertTxt.style.color = "#f00"
        alertTxt.innerHTML = "Confira seus dados e tente novamente"
        loginBtn.innerHTML = `ENTRAR`
        loginBtn.classList.remove("loading")
        setTimeout(() => {
            alertTxt.innerHTML = ""
        }, 5000);
    }
}



function createNewAccount(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            removeTemporaryPassword(email, password)
        })
        .catch((error) => {
            alertTxt.style.color = "#f00"
            alertTxt.innerHTML = "Confira seus dados e tente novamente"
            loginBtn.innerHTML = `ENTRAR`
            loginBtn.classList.remove("loading")
            setTimeout(() => {
                alertTxt.innerHTML = ""
            }, 5000);
        });
}

async function removeTemporaryPassword(email, password) {
    let cityRef = doc(db, 'users', `${email}`);
    await updateDoc(cityRef, {
        temporaryPassword: deleteField()
    });
    window.location.href = "index.html"
}

resetEmail.onclick = () => {
    let email = document.getElementById("emailInput").value
    if (email != "") {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alertTxt.style.color = "var(--black)"
                alertTxt.innerHTML = "Email de redefinição de senha enviado"
                setTimeout(() => {
                    alertTxt.innerHTML = ""
                }, 5000);
            })
            .catch((error) => {
                alertTxt.style.color = "#f00"
                alertTxt.innerHTML = "Confira seu email e tente novamente"
                setTimeout(() => {
                    alertTxt.innerHTML = ""
                }, 5000);
            });
    } else {
        alertTxt.style.color = "#f00"
        alertTxt.innerHTML = "Preencha o campo de email para continuar"
        loginBtn.innerHTML = `ENTRAR`
        loginBtn.classList.remove("loading")
        setTimeout(() => {
            alertTxt.innerHTML = ""
        }, 5000);
    }
}

