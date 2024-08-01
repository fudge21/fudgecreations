// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore,  collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { GoogleAuthProvider, getAuth,signInWithRedirect, GithubAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzjNenZXk2gKXSu-6B6uW9DlpdoP06RUc",
  authDomain: "fudge-creations.firebaseapp.com",
  projectId: "fudge-creations",
  storageBucket: "fudge-creations.appspot.com",
  messagingSenderId: "949875472904",
  appId: "1:949875472904:web:65df5a963f56b0185a6fbd",
  measurementId: "G-EV3NG45468",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const auth = getAuth();

auth.useDeviceLanguage()

document.querySelector("#google").addEventListener("click", function () {
  signInWithRedirect(auth, googleProvider)
})

document.querySelector("#github").addEventListener("click", function () {
  signInWithRedirect(auth, githubProvider)
})

document.querySelector("#go").addEventListener("click", function () {
  signInWithEmailAndPassword(auth, document.querySelector("#email").Value, document.querySelector("#password").Value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
    window.location.location = "/"
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
})

// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     dateJoined: new Date().toDateString(),
//     timeJoined: new Date().toTimeString()
//   })
// } catch (e) {
//   console.error("Error creating document: ",e)
// }