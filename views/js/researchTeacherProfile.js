import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, updatePassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageReference, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

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
const auth = getAuth(app);
const storage = getStorage(app);

let currentName = "";  // Store the current name here

function loadProfileData() {
    const userUID = sessionStorage.getItem('userUID');
    if (!userUID) {
        window.location.href = 'index.html';  // Redirect if not logged in
        return;
    }

    const userRef = ref(db, `Research Teacher/${userUID}`);
    onValue(userRef, (snapshot) => {
        const adminInfo = snapshot.val();

        if (adminInfo) {
            currentName = adminInfo.name;  // Save the original name
            document.getElementById('profileNameInput').value = adminInfo.name;
            document.getElementById('profileEmailInput').value = adminInfo.email;

            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/re-search-9c52f.appspot.com/o/ProfileImages%2F${userUID}?alt=media`;
            document.querySelector('.profile-image').src = imageUrl;
            document.querySelector('.profile-pic').src = imageUrl;
        } else {
            window.location.href = 'index.html';  // Redirect if no data found
        }
    });
}

window.addEventListener('load', loadProfileData);

document.getElementById('saveChangesButton').addEventListener('click', async function () {
    const newName = document.getElementById('profileNameInput').value;
    const newPassword = document.getElementById('newPassword').value;
    const userUID = sessionStorage.getItem('userUID');
    let changesMade = false;
    let message = "";

    if (userUID) {
        const userRef = ref(db, `Research Teacher/${userUID}`);

        try {
            if (newName && newName !== currentName) {
                await update(userRef, { name: newName });
                message = "Name changed successfully.";
                changesMade = true;
            }

            if (newPassword && newPassword !== "") {
                const user = auth.currentUser;
                await updatePassword(user, newPassword);
                message = changesMade ? "Name and password updated successfully." : "Password updated successfully.";
                changesMade = true;
            }

            if (!changesMade) {
                message = "No changes were made.";
            }

            alert(message);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating your profile.");
        }
    } else {
        console.warn("User not authenticated.");
    }
});

document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const userUID = sessionStorage.getItem('userUID');

    if (file && userUID) {
        const validTypes = ['image/jpeg', 'image/png'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            alert("Invalid file type. Please upload an image in JPEG or PNG format.");
            return;
        }

        if (file.size > maxFileSize) {
            alert("File is too large. Please upload an image smaller than 5MB.");
            return;
        }

        const storagePath = `ProfileImages/${userUID}`;
        const storageRef = storageReference(storage, storagePath);

        uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                const userRef = ref(db, `Research Teacher/${userUID}`);
                update(userRef, { profileImage: downloadURL }).then(() => {
                    document.querySelector('.profile-image').src = downloadURL;
                    document.querySelector('.profile-pic').src = downloadURL;
                    document.querySelector('.dpicn').src = downloadURL;
                    alert("Image uploaded successfully.");
                }).catch((error) => {
                    console.error("Error updating profile image URL:", error);
                });
            });
        }).catch((error) => {
            console.error("Error uploading file:", error);
        });
    } else {
        console.warn("No file selected or user not authenticated.");
    }
});

document.getElementById('showLogoutModal').addEventListener('click', function () {
    document.getElementById('logoutModal').style.display = 'block';
});

document.getElementById('signoutButton').addEventListener('click', function () {
    signOut(auth).then(() => {
        sessionStorage.removeItem('userUID');  // Clear sessionStorage on logout
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});

document.querySelector('.btn-cancel').addEventListener('click', function () {
    document.getElementById('logoutModal').style.display = 'none';
});