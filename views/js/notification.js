import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, onChildAdded, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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

const teacherUID = sessionStorage.getItem("userUID");
const booksRef = ref(db, "Books");
const notificationContainer = document.getElementById("notificationContainer");
const circle = document.querySelector(".message .circle");

// Variables to manage notifications
const displayedNotifications = new Set();
let allNotifications = []; // Store all notifications
let showAll = false; // Flag to toggle "Show All" state

function createNotification(message, uploadDate, isNew) {
    if (displayedNotifications.has(message)) return; // Prevent duplicates
    displayedNotifications.add(message);

    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.classList.add(isNew ? "new-notification" : "old-notification");

    const timeAgo = uploadDate ? timeSince(uploadDate) : "";
    notification.innerHTML = `
        <span>${message}</span>
        <span class="timestamp">${timeAgo}</span>
    `;

    // Redirect to teacherRequests.html on click
    notification.addEventListener("click", () => {
        window.location.href = "teacherRequests.html";
    });

    allNotifications.push(notification);
    updateNotificationDisplay();
}

function updateNotificationDisplay() {
    notificationContainer.innerHTML = ""; // Clear the container

    // Determine the number of notifications to show based on the state
    const notificationsToShow = showAll ? allNotifications : allNotifications.slice(0, 5);

    notificationsToShow.forEach(notification => {
        notificationContainer.appendChild(notification);
    });

    if (allNotifications.length > 5 && !showAll) {
        const showAllButton = document.createElement("div");
        showAllButton.classList.add("show-all-button");
        showAllButton.innerText = "Show All Notifications";
        showAllButton.addEventListener("click", () => {
            showAll = true;
            updateNotificationDisplay();
            notificationContainer.style.overflowY = "scroll"; // Enable scrolling when showing all
            notificationContainer.style.maxHeight = "300px"; // Set max height for scrolling
        });
        notificationContainer.appendChild(showAllButton);
    }
}

document.querySelector(".message .icn").addEventListener("click", () => {
    notificationContainer.style.display =
        notificationContainer.style.display === "none" || !notificationContainer.style.display ? "block" : "none";
    circle.style.display = "none";
});

async function fetchUploaderName(uid) {
    try {
        const snapshot = await get(ref(db, `accounts/${uid}/fullname`));
        return snapshot.exists() ? snapshot.val() : "Unknown";
    } catch (error) {
        console.error("Error fetching uploader name:", error);
        return "Unknown";
    }
}

function timeSince(uploadDate) {
    const seconds = Math.floor((Date.now() - uploadDate) / 1000);
    let interval = seconds / 31536000;

    if (interval >= 1) {
        return Math.floor(interval) + " year" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
        return Math.floor(interval) + " month" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 86400;
    if (interval >= 1) {
        return Math.floor(interval) + " day" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 3600;
    if (interval >= 1) {
        return Math.floor(interval) + " hour" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    interval = seconds / 60;
    if (interval >= 1) {
        return Math.floor(interval) + " minute" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }
    return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s") + " ago";
}

onChildAdded(booksRef, async (snapshot) => {
    const book = snapshot.val();
    if (book.adviserUID === teacherUID) {
        const title = book.title || "Untitled Research";
        const uploaderName = await fetchUploaderName(book.uid);
        const uploadDate = book.uploadDate || Date.now();
        createNotification(`New Research Added: "${title}" by ${uploaderName}`, uploadDate, true);
        circle.style.display = "block"; // Show the notification circle
    }
});

async function loadNotifications() {
    notificationContainer.innerHTML = "";
    displayedNotifications.clear(); // Reset for fresh loading
    allNotifications = []; // Reset notifications array

    const snapshot = await get(booksRef);
    if (snapshot.exists()) {
        let hasNotifications = false;
        const books = snapshot.val();

        for (const key in books) {
            const book = books[key];
            if (book.adviserUID === teacherUID) {
                hasNotifications = true;
                const title = book.title || "Untitled Research";
                const uploaderName = await fetchUploaderName(book.uid);
                const uploadDate = book.uploadDate || Date.now();
                createNotification(`New Research Added: "${title}" by ${uploaderName}`, uploadDate, false);
            }
        }

        if (!hasNotifications) {
            createNotification("No new notifications", null, false);
        }
    } else {
        createNotification("No new notifications", null, false);
    }
}

loadNotifications();