// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore,  collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { GoogleAuthProvider, getAuth,signInWithRedirect, createUserWithEmailAndPassword, GithubAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

function signInOrSignUp(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Successfully signed in
      const user = userCredential.user;
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, so create a new account
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Successfully created a new account
            const user = userCredential.user;
          })
          .catch((signUpError) => {
            // Handle errors during account creation
            console.error("Error creating account:", signUpError);
          });
      } else {
        // Handle other sign-in errors
        console.error("Error signing in:", error);
      }
    });
}

document.querySelector("#google").addEventListener("click", function () {
  signInWithRedirect(auth, googleProvider)
})

document.querySelector("#github").addEventListener("click", function () {
  signInWithRedirect(auth, githubProvider)
})

document.querySelector("#go").addEventListener("click", function () {
  signInOrSignUp(document.querySelector("#email").value, document.querySelector("#password").value)
  // createUserWithEmailAndPassword(auth, document.querySelector("#email").value, document.querySelector("#password").value)
  // .then((userCredential) => {
  //   // Signed up 
  //   const user = userCredential.user;
  //   // ...
  //   // window.location.location = "/"
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // ..
  // });
})

// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     dateJoined: new Date().toDateString(),
//     timeJoined: new Date().toTimeString()
//   })
// } catch (e) {
//   console.error("Error creating document: ",e)
// }