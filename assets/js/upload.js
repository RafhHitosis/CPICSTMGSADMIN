import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js"; // Ensure `remove` is imported
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";


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
const storage = getStorage(app);

// Elements
const notificationBell = document.querySelector('.notification-bell');
const notificationsDropdown = document.querySelector('.notifications-dropdown');
const badge = document.querySelector('.badge');
const requestList = document.getElementById('requestList');

// Function to fetch and display requests
function fetchRequests() {
    const requestsRef = ref(database, 'gradeRequests');

    onValue(requestsRef, (snapshot) => {
        requestList.innerHTML = '';  // Clear the current list
        const data = snapshot.val();
        let totalRequests = 0;

        if (data) {
            const instructorRequests = {};

            Object.keys(data).forEach((key) => {
                const request = data[key];
                const instructorName = request.instructor;

                // Group requests by instructor name
                if (!instructorRequests[instructorName]) {
                    instructorRequests[instructorName] = [];
                }
                instructorRequests[instructorName].push({ ...request, id: key });
                totalRequests++;
            });

            // Update the badge count based on total requests
            badge.textContent = totalRequests;
            badge.style.display = totalRequests > 0 ? 'inline-block' : 'none';  // Show or hide the badge

            // Populate the dropdown with requests categorized by instructor
            Object.keys(instructorRequests).forEach((instructor) => {
                const instructorItem = document.createElement('li');
                instructorItem.classList.add('instructor-category');
                instructorItem.textContent = instructor;  // Set the instructor name as category header

                const instructorRequestsList = document.createElement('ul');

                instructorRequests[instructor].forEach((request) => {
                    const requestItem = document.createElement('li');
                    requestItem.classList.add('request-item');  // Add class for styling
                    requestItem.innerHTML = `
                        <div class="request-content">
                            <span class="request-text"><span class="request-label">Semester:</span> ${request.semester}</span>
                            <span class="request-text"><span class="request-label">Subject:</span> ${request.subject}</span>
                            <span class="request-text"><span class="request-label">Instructor:</span> ${instructor}</span>
                        </div>
                        <button class="delete-request" data-id="${request.id}">Delete</button>
                    `;
                    instructorRequestsList.appendChild(requestItem);
                });

                instructorItem.appendChild(instructorRequestsList);
                requestList.appendChild(instructorItem);
            });

            // Attach click event listeners to delete buttons
            document.querySelectorAll('.delete-request').forEach(button => {
                button.addEventListener('click', (event) => {
                    const requestId = event.target.getAttribute('data-id');
                    deleteRequest(requestId);
                });
            });

        } else {
            // If no requests found, show a message and hide the badge
            requestList.innerHTML = '<li>No requests found.</li>';
            badge.textContent = 0;
            badge.style.display = 'none';  // Hide the badge when there are no requests
        }
    }, (error) => {
        console.error("Error fetching requests: ", error);
    });
}


// Function to delete a request from Firebase
function deleteRequest(requestId) {
    const requestRef = ref(database, `gradeRequests/${requestId}`);
    remove(requestRef)
        .then(() => {
            console.log(`Request ${requestId} deleted successfully.`);
            fetchRequests();  // Refresh the requests after deletion
        })
        .catch((error) => {
            console.error("Error deleting request: ", error);
        });
}

// Toggle notifications dropdown visibility on bell icon click with animation
notificationBell.addEventListener('click', () => {
    if (notificationsDropdown.classList.contains('hide') || notificationsDropdown.style.display === 'none') {
        notificationsDropdown.classList.remove('hide');
        notificationsDropdown.classList.add('show');
        notificationsDropdown.style.display = 'block';  // Make sure the dropdown is set to block
    } else {
        notificationsDropdown.classList.remove('show');
        notificationsDropdown.classList.add('hide');
        setTimeout(() => {
            notificationsDropdown.style.display = 'none';  // Hide the dropdown after the animation
        }, 300);  // Match this duration with the CSS animation duration
    }
});

// Fetch requests when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchRequests();
});






// Elements
const uploadFilesButton = document.getElementById('uploadFilesButton');
const fileUploadDialog = document.getElementById('fileUploadDialog');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const closeDialogButton = document.getElementById('closeDialogButton');
const uploadStatus = document.getElementById('uploadStatus');

// Show the file upload dialog when 'Upload Files' is clicked
uploadFilesButton.addEventListener('click', () => {
    fileUploadDialog.classList.remove('hide');
    fileUploadDialog.classList.add('show');
});

// Close the file upload dialog
closeDialogButton.addEventListener('click', () => {
    fileUploadDialog.classList.remove('show');
    fileUploadDialog.classList.add('hide');
});

// Handle file upload
uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
        const storageReference = storageRef(storage, `requests/${file.name}`); // Store file in 'requests' folder

        // Create a file upload task
        const uploadTask = uploadBytesResumable(storageReference, file);

        // Monitor file upload progress
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadStatus.textContent = `Upload is ${progress.toFixed(2)}% done`;
            },
            (error) => {
                console.error('Error during file upload:', error);
                uploadStatus.textContent = 'Upload failed. Please try again.';
            },
            () => {
                // File upload completed successfully
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    uploadStatus.textContent = 'Upload successful! File available at: ' + downloadURL;

                    // Optionally, you can save the file URL to Firebase Realtime Database or perform other actions here.
                });
            }
        );
    } else {
        alert('Please select a file to upload.');
    }
});