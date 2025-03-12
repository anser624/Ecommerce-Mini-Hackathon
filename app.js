import {
  auth,
  db,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "./firebase.js";

onAuthStateChanged(auth, (user) => {
    if (!user && !window.location.pathname.includes('loginpage.html')) {
      window.location.href = 'loginpage.html';
    }
});

const loginBtn = document.getElementById('login');

if (loginBtn) {

    loginBtn.addEventListener('click',
    async (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      const email = document.getElementById('email').value;
      try {
          await signInWithEmailAndPassword(auth, email, password);
          window.location.href = 'index.html';
          alert('Logged in successfully');
      } catch (error) {
        alert("Please enter correct email and password");
      }
    });
}

const logoutBtn = document.getElementById('logout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    alert('Logged out successfully');
    window.location.href = 'loginpage.html';
  });
}


const signupBtn = document.getElementById('signup');
if (signupBtn) {
  signupBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert('User created successfully!');
      window.location.href = 'index.html'; // Redirect to main page after signup
    } catch (error) {
      // Handle errors
      if (error.code === 'auth/email-already-in-use') {
        alert('Email is already in use. Please use a different email.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters.');
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  });
}
