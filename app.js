import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getDatabase, ref, push, onChildAdded, update, remove } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5usc3uCHwUfU6_83a03l9VtlE6m1G5i0",
  authDomain: "realtime-database-aef62.firebaseapp.com",
  projectId: "realtime-database-aef62",
  storageBucket: "realtime-database-aef62.firebasestorage.app",
  messagingSenderId: "320183525284",
  appId: "1:320183525284:web:816b0a6554dc9f18f2eb31",
  measurementId: "G-5XFP889DSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

//signup code
document.getElementById('signup-btn')?.addEventListener('click', () => {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = 'chat.html';
    })
    .catch((error) => {
      alert(error.message);
    })
});

//login code
document.getElementById('login-btn')?.addEventListener('click', () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = 'chat.html';
    })
    .catch((error) => {
      alert(error.message);
    })
});

//continue with google
document.getElementById('google-btn')?.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = 'chat.html';
    })
    .catch((error) => {
      alert(error.message);
    });
});

//logout code  
document.getElementById("logout-btn")?.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logged Out Successfully!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Reset Password
document.getElementById("reset-password-link")?.addEventListener("click", (e) => {
  e.preventDefault(); 
  const email = prompt("Please enter your email address:");

  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  } else {
    alert("Please enter a valid email address.");
  }
});


//ChatApp code
window.sendMessage = function () {
  let username = document.getElementById("username").value;
  let message = document.getElementById("message").value;
  if (username === "" || message === "") return;


  // Push message to Firebase
  push(ref(db, "messages"), {
    name: username,
    text: message
  });
  document.getElementById("message").value = ""; // Clear input
};

document.getElementById("message").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// Function to listen for new messages
onChildAdded(ref(db, "messages"), function (snapshot) {
  let data = snapshot.val();
  let messageBox = document.getElementById("messages");

  // Create message container
  let msgElement = document.createElement("div");
  msgElement.classList.add("message-container");

  // Circle avatar (first letter)
  let avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.textContent = data.name ? data.name[0].toUpperCase() : "?";

  // Message bubble
  let bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = data.text;

  // Edit/Delete buttons container
  let btnContainer = document.createElement("div");
  btnContainer.classList.add("msg-actions");

  let editBtn = document.createElement("button");
  editBtn.textContent = "✎";
  editBtn.classList.add("edit-btn");

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.classList.add("delete-btn");

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);
  bubble.appendChild(btnContainer);

  // Get current user
  let currentUser = document.getElementById("username").value;

  // Only show for own messages
  if (data.name === currentUser && currentUser !== "") {
    msgElement.classList.add("self");

    editBtn.onclick = function () {
      let newText = prompt("Edit your message:", data.text);
      if (newText && newText.trim() !== "") {
        update(ref(db, "messages/" + snapshot.key), { text: newText });
        bubble.textContent = newText;
        bubble.appendChild(btnContainer); // reattach buttons after edit
      }
    };

    deleteBtn.onclick = function () {
      if (confirm("Are you sure you want to delete this message?")) {
        remove(ref(db, "messages/" + snapshot.key));
        msgElement.remove();
      }
    };
  } else {
    // If not current user's message — remove edit/delete
    btnContainer.style.display = "none";
  }

  msgElement.appendChild(avatar);
  msgElement.appendChild(bubble);

  messageBox.appendChild(msgElement);
  messageBox.scrollTop = messageBox.scrollHeight;
});

// ✅ Send message by pressing Enter key
document.getElementById("message").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});













