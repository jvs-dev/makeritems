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
import { getFirestore, collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
let itemsSecion = document.getElementById("itemsSecion")
let editItemBackground = document.getElementById("editItemBackground")
let editItemClose = document.getElementById("editItemClose")

editItemClose.onclick = () => {
  editItemBackground.style.opacity = "0"
  setTimeout(() => {
    editItemBackground.style.display = "none"
  }, 200);
}

async function loadItems() {
  let i = 0
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
        <div class="item-card__loading" id="loadingImg${i}"></div>
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
        let loadingImgCard = document.getElementById(`loadingImg${i}`)
        setTimeout(() => {
          loadingImgCard.style.display = "none"
        }, 1000);
        removeBtn.onclick = () => {
          if (doc.data().itemQuanty > 0) {
            removeItem(doc.id, p, 1)
          }
        }
        addBtn.onclick = () => {
          addItem(doc.id, p, 1)
        }
        p.onclick = () => {
          editItem(doc.id, p, url, p.textContent, doc.data().itemName)
        }
        i++
      })
      .catch((error) => {
      });
  });
}

async function removeItem(id, p, value) {
  let washingtonRef = doc(db, "items", `${id}`);
  await updateDoc(washingtonRef, {
    itemQuanty: increment(-value)
  });
  let docRef = doc(db, "items", `${id}`);
  let docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    p.textContent = `TOTAL: ${docSnap.data().itemQuanty} unid.`
  }
}

async function addItem(id, p, value) {
  let washingtonRef = doc(db, "items", `${id}`);
  await updateDoc(washingtonRef, {
    itemQuanty: increment(+value)
  });
  let docRef = doc(db, "items", `${id}`);
  let docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    p.textContent = `TOTAL: ${docSnap.data().itemQuanty} unid.`
  }
}


async function editItem(id, p, url, itemQuanty, itemName) {
  let editItemImg = document.getElementById("editItemImg")
  let editItemName = document.getElementById("editItemName")
  let editItemInput = document.getElementById("editItemInput")
  let editItemAdd = document.getElementById("editItemAdd")
  let editItemRemove = document.getElementById("editItemRemove")
  let confirmEditItem = document.getElementById("confirmEditItem")
  let editItemDelete = document.getElementById("editItemDelete")
  confirmEditItem.innerHTML = `Confirmar`
  confirmEditItem.classList.remove("loading")
  editItemName.textContent = itemName
  editItemInput.value = Number(itemQuanty.replace("TOTAL: ", "").replace(" unid.", ""))
  editItemImg.src = url
  editItemBackground.style.display = "flex"
  setTimeout(() => {
    editItemBackground.style.opacity = "1"
  }, 1);
  editItemAdd.onclick = () => {
    editItemInput.value = Number(Number(editItemInput.value) + 1)
  }
  editItemRemove.onclick = () => {
    editItemInput.value = Number(Number(editItemInput.value) - 1)
  }
  confirmEditItem.onclick = async () => {
    confirmEditItem.innerHTML = `<div class="loader"></div>`
    confirmEditItem.classList.add("loading")
    let washingtonRef = doc(db, "items", `${id}`);
    await updateDoc(washingtonRef, {
      itemQuanty: Number(editItemInput.value)
    });
    let docRef = doc(db, "items", `${id}`);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      p.textContent = `TOTAL: ${docSnap.data().itemQuanty} unid.`
      editItemBackground.style.opacity = "0"
      setTimeout(() => {
        editItemBackground.style.display = "none"
      }, 200);
    }
  }
  editItemDelete.onclick = async () => {
    let addingItem = document.querySelector(".addingItem")
    let desertRef = ref(storage, `items/${id}.jpg`)
    addingItem.style.display = "flex"
    setTimeout(() => {
      addingItem.style.opacity = "1"
    }, 1);
    deleteObject(desertRef).then(async () => {
      await deleteDoc(doc(db, "items", `${id}`));
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    }).catch((error) => {
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    });
  }
}




loadItems()