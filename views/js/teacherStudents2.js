import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, child, onValue, update, get, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
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
const db = getDatabase(app);
const auth = getAuth(app);

const userUID = sessionStorage.getItem("userUID");
const entriesDropdown = document.getElementById("entriesPerPage");
const coursesRef = ref(db, `Courses/${userUID}`);

function populateSectionsDropdown() {
    onValue(coursesRef, (snapshot) => {
        entriesDropdown.innerHTML = ""; // Clear existing options

        const defaultOption = document.createElement("option");
        defaultOption.value = ""; // No value for default
        defaultOption.text = "Select a section"; // Display text for default
        defaultOption.style.display = "none"; // Initially hidden
        entriesDropdown.appendChild(defaultOption);

        const showAllOption = document.createElement("option");
        showAllOption.value = "showAll"; // Value for "Show All"
        showAllOption.text = "Show All"; // Display text for "Show All"
        entriesDropdown.appendChild(showAllOption);

        if (snapshot.exists()) {
            snapshot.forEach((courseSnapshot) => {
                const courseData = courseSnapshot.val();

                if (courseData.noMajor) {
                    Object.keys(courseData).forEach((key) => {
                        if (key !== "courseName" && key !== "courseAcronym") {
                            const section = courseData[key];
                            if (section.sectionName) {
                                const option = document.createElement("option");
                                option.value = key; // Set section key
                                option.text = section.sectionName; // Display section name
                                entriesDropdown.appendChild(option);
                            }
                        }
                    });
                } else {
                    Object.keys(courseData).forEach((majorKey) => {
                        if (majorKey !== "courseName" && majorKey !== "courseAcronym") {
                            const majorSections = courseData[majorKey];
                            Object.keys(majorSections).forEach((sectionKey) => {
                                const section = majorSections[sectionKey];
                                if (section.sectionName) {
                                    const option = document.createElement("option");
                                    option.value = sectionKey; // Set section key
                                    option.text = section.sectionName; // Display section name
                                    entriesDropdown.appendChild(option);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            console.log("No sections found for this user.");
        }

        entriesDropdown.value = "showAll";
        createStudentTable(); // Populate the table with all students initially
    });
}

let students = []; // Array to hold the fetched students

function fetchStudents() {
    const studentsRef = ref(db, 'accounts');
    onValue(studentsRef, (snapshot) => {
        students = []; // Clear the previous students
        snapshot.forEach(childSnapshot => {
            const studentData = childSnapshot.val();
            const studentId = childSnapshot.key; // Unique ID
            students.push({
                uid: studentId, // Include UID
                studentno: studentData.studentno || studentId,
                fullname: studentData.fullname,
                email: studentData.email,
                userType: studentData.userType, // Include userType
                gender: studentData.gender, // Include gender
                section: studentData.section // Include section for filtering
            });
        });
        createStudentTable(); // Update table after fetching data
    });
}

let selectedCourse = ''; // Declare selectedCourse at a broader scope

entriesDropdown.addEventListener("change", function () {
    const selectedValue = entriesDropdown.value;

    if (selectedValue !== "") {
        selectedCourse = selectedValue; // Store the selected course value
        entriesDropdown.options[0].style.display = "none"; // Hide "Select a section"
    } else {
        entriesDropdown.options[0].style.display = "block"; // Show "Select a section"
    }

    console.log("Selected Section:", selectedValue);
    console.log("Students Data:", students);
    createStudentTable(); // Refresh the table on section change
});

let currentSortHeader = ''; // Track which header is currently sorted
let currentSortOrder = 'asc'; // Track the current sort order

const searchInput = document.getElementById("search-bar");
const searchButton = document.querySelector(".search-button");

function searchStudents() {
    const searchTerm = searchInput.value.toLowerCase().trim(); // Get the search term and convert to lowercase
    const filteredStudents = students.filter(student => {
        return student.studentno.toString().includes(searchTerm) || // Check if studentno includes the search term
            student.fullname.toLowerCase().includes(searchTerm) || // Check if fullname includes the search term
            student.email.toLowerCase().includes(searchTerm); // Check if email includes the search term
    });
    createStudentTable(filteredStudents); // Pass the filtered students to createStudentTable
}

function createStudentTable(filteredStudents = students) {
    const studentMain = document.getElementById('student-table');
    studentMain.innerHTML = ''; // Clear previous table

    if (entriesDropdown.options.length === 0) {
        console.log("No sections available in the dropdown.");
        return; // Exit the function if no sections are available
    }

    const selectedValue = entriesDropdown.value; // Get selected value from dropdown
    let selectedSectionStudents;

    if (selectedValue === "showAll") {
        selectedSectionStudents = filteredStudents.filter(student => {
            return Array.from(entriesDropdown.options)
                .filter(option => option.value !== "showAll" && option.value !== "")
                .some(option => option.text === student.section);
        });
    } else {
        const selectedSectionName = entriesDropdown.options[entriesDropdown.selectedIndex].text;
        selectedSectionStudents = filteredStudents.filter(student => student.section === selectedSectionName);
    }

    if (selectedSectionStudents.length === 0) {
        const noDataMessage = document.createElement('div');
        noDataMessage.classList.add('no-data-message');
        noDataMessage.textContent = "No students found.";
        studentMain.appendChild(noDataMessage);
        return; // Exit the function as there is no data to display
    }

    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['Student Number', 'Name', 'Section', 'Email', 'Role' ,'Actions'];

    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;

        if (headerText !== 'Email' && headerText !== 'Actions' && headerText !== 'Section' && headerText !== 'Role') {
            const arrow = document.createElement('span');
            arrow.textContent = ' ▼'; // Default arrow for unsorted columns
            arrow.classList.add('sort-arrow');
            arrow.onclick = () => {
                const newOrder = currentSortHeader === headerText && currentSortOrder === 'asc' ? 'desc' : 'asc';
                sortTable(headerText, newOrder);
            };
            header.appendChild(arrow);
        }

        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    selectedSectionStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${student.studentno}</td>
    <td>${student.fullname}</td>
    <td>${student.section}</td>
    <td>${student.email}</td>
    <td>${student.userType}</td>
    <td><img src="/images/eye.png" alt="View" class="eye-icon" onclick="viewStudent('${student.studentno}')"></td>
`;
        table.appendChild(row);
    });

    tableContainer.appendChild(table);
    studentMain.appendChild(tableContainer);

    const studentCountInfo = document.createElement('div');
    studentCountInfo.classList.add('student-count-info');
    studentCountInfo.textContent = `Total students: ${selectedSectionStudents.length}`; // Update count based on filtered results
    studentMain.appendChild(studentCountInfo);
}

function sortTable(header, order) {
    const key = header === 'Student Number' ? 'studentno' : header === 'Name' ? 'fullname' : 'email';
    students.sort((a, b) => {
        if (order === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
    currentSortHeader = header; // Set the current sorted header
    currentSortOrder = order; // Set the current sort order
    createStudentTable(); // Recreate the table
}

searchButton.addEventListener("click", searchStudents);
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchStudents(); // Call the search function on Enter key
    }
});

fetchStudents(); // Fetch the students on page load
populateSectionsDropdown();


let overlay; // Declare the overlay variable globally

window.viewStudent = function (studentno) {
    const student = students.find(s => s.studentno === studentno);
    if (!student) return;

    const genderMap = {
        'F': 'Female',
        'M': 'Male'
    };
    const gender = genderMap[student.gender] || 'Not specified'; // Default if gender is undefined

    const userType = student.userType === 'Leader' ? 'Leader' : 'Member';

    overlay = document.createElement('div'); // Use the global overlay variable
    overlay.classList.add('modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('student-view-modal');

    modal.innerHTML = `
<div class="modal-content">
    <h2>Student Details</h2>
    <p><strong>Student Number:</strong> ${student.studentno}</p>    
    <p><strong>Name:</strong> ${student.fullname}</p>
    <p><strong>Gender:</strong> ${gender}</p>
    <p><strong>Email:</strong> ${student.email}</p>
    <p><strong>Role:</strong> ${userType}</p>

    <div class="modal-buttons">
    <button id="setLeaderButton" ${userType === 'Leader' ? 'disabled' : ''}>Set as Leader</button>
    <button id="setStudentButton" ${userType === 'Member' ? 'disabled' : ''}>Set as Member</button>
    <button id="cancelButton">Cancel</button>
    </div>
</div>
`;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    document.getElementById('setLeaderButton').onclick = () => setAsLeader(studentno);
    document.getElementById('setStudentButton').onclick = () => setAsMember(studentno);
    document.getElementById('cancelButton').onclick = () => closeModal(modal);

    modal.style.display = 'block';
};

function closeModal(modal) {
    modal.remove();
    if (overlay) {
        overlay.remove(); // Remove overlay if it exists
    }
}

window.setAsMember = function (studentno) {
    const student = students.find(s => s.studentno === studentno);
    if (student) {
        student.userType = 'user';

        const uid = auth.currentUser.uid; // Get the UID of the currently authenticated user
        const studentRef = ref(db, `accounts/${student.uid}`); // Directly reference the student's UID

        update(studentRef, { userType: 'user' })
            .then(() => {
                alert(`${student.fullname} is now set as Member.`);
                document.querySelector('.student-view-modal').remove();
                createStudentTable(); // Refresh the student table
                overlay.remove();
            })
            .catch((error) => {
                console.error("Error updating user type:", error);
            });
    }
};

window.setAsLeader = function (studentno) {
    const student = students.find(s => s.studentno === studentno);
    if (student) {
        student.userType = 'Leader';

        const uid = auth.currentUser.uid;
        const studentRef = ref(db, `accounts/${student.uid}`);
        update(studentRef, { userType: 'Leader' })
            .then(() => {
                alert(`${student.fullname} is now set as Leader.`);
                document.querySelector('.student-view-modal').remove();
                createStudentTable();
                overlay.remove();
            })
            .catch((error) => {
                console.error("Error updating user type:", error);
            });
    }
};