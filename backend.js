// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { GoogleAuthProvider, updateProfile, getAuth, signOut, getRedirectResult, onAuthStateChanged, signInWithRedirect, signInWithPopup, createUserWithEmailAndPassword, GithubAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
  cookies: {
    domain: '.fudgecreations.com',
  },
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

if (window.location.pathname == "/auth/") {
  document.querySelector("#google").addEventListener("click", function () {
    // signInWithRedirect(auth, googleProvider)
    signInWithPopup(auth, googleProvider)
  })

  document.querySelector("#github").addEventListener("click", function () {
    // signInWithRedirect(auth, githubProvider)
    signInWithPopup(auth, githubProvider)
  })

  document.querySelector("#go").addEventListener("click", function () {
    signInOrSignUp(document.querySelector("#email").value, document.querySelector("#password").value)
  })

  // document.querySelector("#next").addEventListener("click", function () {
  //   window.location.href = "/"
  // })
  document.querySelector("#next").addEventListener("click", async function () {
  if (await verifyUsername() == true) {
    if (await verifyDisplayName() == true) {
      if (await isUsernameAvailable(document.querySelector("#username").value)) {
        document.querySelector("#next").disabled = true
        await updateProfile(auth.currentUser, {
          displayName: document.querySelector("#username").value+","+document.querySelector("#displayname").value, 
        })
        await saveUsername(auth.currentUser.uid, document.querySelector("#username").value)
        window.location.href = "/"
      } else {
        document.querySelector("#feedback").textContent = "username taken"
      }
    }
  }
  })
  onAuthStateChanged(auth, (user) => {
    if (user && user.displayName != null && user.displayName.includes(",")) {
      window.location.href = "/"
    } else {
      console.log("User not configured");
    }
  });
} else {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      let displayName = user.displayName || ""
      if (displayName.includes(",") == false) {
        window.location.href = "/auth/"
      }
    }
  });
}



if (window.location.pathname == "/settings/") {
  document.querySelector("#signOut").addEventListener("click", function () {
    signOut(auth)
    window.location.href = "/"
  })
}

async function verifyUsername() {
  const regex = /^[a-z0-9_]+$/;
  const username = document.querySelector("#username").value
  const moderatedText = await moderateText(username)
  let feedback = "Requirements met"
  if (username.length < 3) {
    feedback = "Must include at least 3 characters in username"
  } else if (username.length > 16) {
    feedback = "Cannot include more than 16 characters in username"
  } else if (!regex.test(username)) {
    feedback = "Only lowercase letters and numbers and underscores are supported in usernames"
  } else if (moderatedText[1]) {
    feedback = "Username cannot contain profanity"
  } else {
    document.querySelector("#feedback").textContent = feedback
    return true
  }
  document.querySelector("#feedback").textContent = feedback
  return false
}

async function verifyDisplayName() {
  const regex = /^[a-zA-Z0-9_ ]+$/;
  const username = document.querySelector("#displayname").value
  const moderatedText = await moderateText(username)
  let feedback = "Requirements met"
  if (username.length < 3) {
    feedback = "Must include at least 3 characters in display name"
  } else if (username.length > 16) {
    feedback = "Cannot include more than 16 characters in display name"
  } else if (!regex.test(username)) {
    feedback = "Only letters, numbers, underscores, and spaces are supported in display names"
  } else if (moderatedText[1]) {
    feedback = "Display name cannot contain profanity"
  } else {
    document.querySelector("#feedback").textContent = feedback
    return true
  }
  document.querySelector("#feedback").textContent = feedback
  return false
}



async function getBadWordsList() {
  const response = await fetch('https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/refs/heads/master/en');
  if (!response.ok) {
    throw new Error('Failed to fetch bad words list');
  }
  const text = await response.text();
  return text.split('\n').map(word => word.trim()).filter(word => word); // Trim and filter empty lines
}

async function moderateText(text) {
  const bannedWords = await getBadWordsList();
  let moderatedText = text;
  let conatinsBadWord = false
  bannedWords.forEach(word => {
    const regex = new RegExp(word, 'gi'); // Match full words only
    let preText = moderatedText+" "
    moderatedText = moderatedText.replace(regex, '****'); // Replace banned words with '****'
    if (preText != moderatedText+" ") {
      conatinsBadWord = true
    } 
  });

  return [moderatedText,conatinsBadWord];
}

async function isUsernameAvailable(username) {
  const db = getFirestore();
  const usernamesRef = collection(db, "usernames");
  const q = query(usernamesRef, where("username", "==", username));

  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // If query is empty, the username is available
}

async function saveUsername(userId, username) {
  const db = getFirestore();
  const userRef = doc(db, "usernames", userId);

  await setDoc(userRef, {
    username: username
  });
  console.log(`Username "${username}" saved successfully.`);
}


// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     dateJoined: new Date().toDateString(),
//     timeJoined: new Date().toTimeString()
//   })
// } catch (e) {
//   console.error("Error creating document: ",e)
// }


onAuthStateChanged(auth, (user) => {
  if (user) {
    document.cookie = "firebase-auth=true; domain=fudgecreations.com; path=/";
    if (window.location.pathname == "/auth/") {
      document.querySelector("#signin").style.display = "none"
      document.querySelector("#userinfo").style.display = "block"
      // setInterval(() => {
      //   window.location.href = "/"
      // }, 100);
    }
    if (document.querySelector('a[href="/auth/"]').querySelector('button')) {
      document.querySelector('a[href="/auth/"]').querySelector('button').textContent = "Settings"
      document.querySelector('a[href="/auth/"]').href = "/settings/"
    }
  } else {
    // No user is signed in
    // console.log("No user is signed in.");
    // if (window.location.pathname != "/auth/") {
    //   window.location.href = "/auth/"
    // }
  }
});

