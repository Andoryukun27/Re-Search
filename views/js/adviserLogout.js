import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHnoQ42UH9XorjdBsN4do1pKlWSRZVrCw",
    authDomain: "re-search-9c52f.firebaseapp.com",
    databaseURL: "https://re-search-9c52f-default-rtdb.firebaseio.com",
    projectId: "re-search-9c52f",
    storageBucket: "re-search-9c52f.appspot.com",
    messagingSenderId: "915263512573",
    appId: "1:915263512573:web:fc6961e880ce8fb1010394",
    measurementId: "G-R0Y7ZMM3XV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function showLogoutModal() {
    const logoutModal = document.querySelector(".logout-modal");
    if (logoutModal) {
        logoutModal.style.display = "flex";
    }
}

function hideLogoutModal() {
    const logoutModal = document.querySelector(".logout-modal");
    if (logoutModal) {
        logoutModal.style.display = "none";
    }
}

const Signout = () => {
    sessionStorage.removeItem('userUID'); // Clear sessionStorage
    window.location.href = "index.html"; // Redirect to login page after sign-out
};

window.addEventListener('load', () => {
    const logoutBtn = document.querySelector("#signoutButton");
    const btnCancel = document.querySelector(".btn-cancel");
    const showLogoutBtn = document.querySelector("#showLogoutModal");

    if (showLogoutBtn) {
        showLogoutBtn.addEventListener("click", showLogoutModal);
    }

    if (btnCancel) {
        btnCancel.addEventListener("click", hideLogoutModal);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", Signout);
    }
});