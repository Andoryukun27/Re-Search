import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

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
const db = getDatabase(app);
const storage = getStorage(app);

const profileMenu = document.getElementById("profileMenu");
const profileBtn = document.querySelector(".dpicn");
let isProfileMenuVisible = false;

profileBtn.onclick = function () {
    isProfileMenuVisible = !isProfileMenuVisible;

    if (isProfileMenuVisible) {
        const rect = profileBtn.getBoundingClientRect();
        profileMenu.style.display = "block";

        const menuWidth = profileMenu.offsetWidth;
        const menuHeight = profileMenu.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        if (left + menuWidth > viewportWidth) {
            left = viewportWidth - menuWidth - 10;
        }

        if (top + menuHeight > viewportHeight) {
            top = rect.top + window.scrollY - menuHeight;
        }

        profileMenu.style.top = `${top}px`;
        profileMenu.style.left = `${left}px`;
    } else {
        profileMenu.style.display = "none";
    }
};

window.onclick = function (event) {
    if (!profileBtn.contains(event.target) && !profileMenu.contains(event.target)) {
        profileMenu.style.display = "none";
        isProfileMenuVisible = false;
    }
};

function loadProfileData() {
    const uid = sessionStorage.getItem('userUID'); // Retrieve UID from sessionStorage
    if (uid) {
        get(child(ref(db), `Admins/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const adminInfo = snapshot.val();

                document.getElementById('profileName').textContent = adminInfo.name;
                document.getElementById('profileEmail').textContent = adminInfo.email;

                const profilePicElement = document.querySelector('.dpicn');
                const fullProfilePicElement = document.querySelector('.profile-pic');

                if (adminInfo.profileImage) {
                    const profileImageRef = storageRef(storage, `ProfileImages/${uid}`);
                    getDownloadURL(profileImageRef)
                        .then((url) => {
                            profilePicElement.src = url;
                            fullProfilePicElement.src = url;
                        })
                        .catch(() => {
                            const defaultImageUrl = 'images/administration.png';
                            profilePicElement.src = defaultImageUrl;
                            fullProfilePicElement.src = defaultImageUrl;
                        });
                } else {
                    const defaultImageUrl = 'images/administration.png';
                    profilePicElement.src = defaultImageUrl;
                    fullProfilePicElement.src = defaultImageUrl;
                }
            } else {
                alert('Admin data not found.');
                window.location.href = 'index.html';
            }
        }).catch((error) => {
            console.error("Error fetching profile data:", error);
        });
    } else {
        window.location.href = 'index.html'; // Redirect if no UID found
    }
}

window.addEventListener('load', loadProfileData);