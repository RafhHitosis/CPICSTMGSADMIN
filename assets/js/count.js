import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgplxh789FO-NDxHmKA49ro71tjYBU-JE",
    authDomain: "icstmgsdb.firebaseapp.com",
    databaseURL: "https://icstmgsdb-default-rtdb.firebaseio.com",
    projectId: "icstmgsdb",
    storageBucket: "icstmgsdb.appspot.com",
    messagingSenderId: "619240877167",
    appId: "1:619240877167:web:9402346b3d9e6e1f57b19a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to count students, instructors, and subjects and display them in the dashboard
function countStudentsInstructorsAndSubjects() {
    // Function to set progress bar width dynamically
    function updateProgressBar(progressElement, value) {
        progressElement.style.setProperty('--progress-width', `${value}%`);
        progressElement.querySelector('::before').style.width = `${value}%`;
    }

    // Count students
    const studentsRef = ref(database, 'normalLogin/students');

    onValue(studentsRef, (snapshot) => {
        const studentsData = snapshot.val();
        const studentCount = studentsData ? Object.keys(studentsData).length : 0;

        // Update the student card in the dashboard with the count
        const studentCountElement = document.querySelector('.info-data .card:nth-child(1) .head h2');
        const studentProgressElement = document.querySelector('.info-data .card:nth-child(1) .progress');
        const studentLabelElement = document.querySelector('.info-data .card:nth-child(1) .label');

        if (studentCountElement) {
            studentCountElement.textContent = studentCount;
            // Calculate percentage (assuming 5000 is the maximum number of students)
            const progressValue = (studentCount / 5000) * 100;
            studentLabelElement.textContent = `${progressValue.toFixed(2)}%`;

            // Update progress bar width dynamically
            studentProgressElement.style.width = `${progressValue}%`;
        }
    });

    // Count instructors
    const instructorsRef = ref(database, 'normalLogin/instructor');

    onValue(instructorsRef, (snapshot) => {
        const instructorsData = snapshot.val();
        const instructorCount = instructorsData ? Object.keys(instructorsData).length : 0;

        // Update the instructor card in the dashboard with the count
        const instructorCountElement = document.querySelector('.info-data .card:nth-child(2) .head h2');
        const instructorProgressElement = document.querySelector('.info-data .card:nth-child(2) .progress');
        const instructorLabelElement = document.querySelector('.info-data .card:nth-child(2) .label');

        if (instructorCountElement) {
            instructorCountElement.textContent = instructorCount;
            // Calculate percentage (assuming 1000 is the maximum number of instructors)
            const progressValue = (instructorCount / 1000) * 100;
            instructorLabelElement.textContent = `${progressValue.toFixed(2)}%`;

            // Update progress bar width dynamically
            instructorProgressElement.style.width = `${progressValue}%`;
        }
    });

    // Count subjects
    const subjectsRef = ref(database, 'subjects');

    onValue(subjectsRef, (snapshot) => {
        const subjectsData = snapshot.val();
        let subjectCount = 0;

        // Loop through all semesters and years dynamically
        if (subjectsData) {
            Object.keys(subjectsData).forEach(semesterYear => {
                // For each semester/year, count all subjects under it
                subjectCount += Object.keys(subjectsData[semesterYear]).length;
            });
        }

        // Update the subject card in the dashboard with the count
        const subjectCountElement = document.querySelector('.info-data .card:nth-child(3) .head h2');
        const subjectProgressElement = document.querySelector('.info-data .card:nth-child(3) .progress');
        const subjectLabelElement = document.querySelector('.info-data .card:nth-child(3) .label');

        if (subjectCountElement) {
            subjectCountElement.textContent = subjectCount;
            // Calculate percentage (assuming 1000 is the maximum number of subjects)
            const progressValue = (subjectCount / 1000) * 100;
            subjectLabelElement.textContent = `${progressValue.toFixed(2)}%`;

            // Update progress bar width dynamically
            subjectProgressElement.style.width = `${progressValue}%`;
        }
    });
}

// Call the function when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    countStudentsInstructorsAndSubjects();  // Fetch and display student, instructor, and subject counts
});
