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
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
let itemsSecion = document.getElementById("itemsSecion")

async function loadItems() {
  let querySnapshot = await getDocs(collection(db, "items"));
  querySnapshot.forEach((doc) => {
    getDownloadURL(ref(storage, `items/${doc.id}.jpg`))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        let article = document.createElement("article")
        let p = document.createElement("p")
        let div = document.createElement("div")
        let removeBtn = document.createElement("button")
        let addBtn = document.createElement("button")
        itemsSecion.insertAdjacentElement("beforeend", article)
        article.classList.add("item-card")
        article.innerHTML = `
        <div class="item-card__divImg">
          <img class="item-card__img" src="${url}" alt="">
        </div>
        <p class="item-card__name">${doc.data().itemName}</p>`
        article.insertAdjacentElement("beforeend", p)
        article.insertAdjacentElement("beforeend", div)
        div.insertAdjacentElement("beforeend", removeBtn)
        div.insertAdjacentElement("beforeend", addBtn)
        p.classList.add("item-card__quanty")
        p.textContent = `TOTAL: ${doc.data().itemQuanty} unid.`
        div.classList.add("item-card__div")
        removeBtn.classList.add("item-card__btn")
        addBtn.classList.add("item-card__btn")
        removeBtn.style = "--clr: #132330;"
        addBtn.style = "--clr: #4684B5;"
        removeBtn.textContent = "-"
        addBtn.textContent = "+"
        removeBtn.onclick = () => {
          if (doc.data().itemQuanty > 0) {
            removeItem(doc.id, p)
          }
        }
        addBtn.onclick = () => {
          addItem(doc.id, p)
        }
      })
      .catch((error) => {
      });
  });
}

async function removeItem(id, p) {
  let washingtonRef = doc(db, "items", `${id}`);
  await updateDoc(washingtonRef, {
    itemQuanty: increment(-1)
  });
  let docRef = doc(db, "items", `${id}`);
  let docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    p.textContent = `TOTAL: ${docSnap.data().itemQuanty} unid.`
  }
}

async function addItem(id, p) {
  let washingtonRef = doc(db, "items", `${id}`);
  await updateDoc(washingtonRef, {
    itemQuanty: increment(+1)
  });
  let docRef = doc(db, "items", `${id}`);
  let docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    p.textContent = `TOTAL: ${docSnap.data().itemQuanty} unid.`
  }
}


loadItems()