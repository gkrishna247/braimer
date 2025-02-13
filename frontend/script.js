// script.js

// Login Function
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // TODO: Replace with your actual backend API endpoint
    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (response.ok) {
            // Redirect to the dashboard on successful login
            window.location.href = 'dashboard.html';
        } else {
            // Handle login errors
            alert('Invalid credentials');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login.');
    });
}

// Event listener for dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on dashboard.html to avoid errors on other pages
    if (window.location.pathname.endsWith('dashboard.html')) {
        const imageUpload = document.getElementById('imageUpload');
        const previewImage = document.getElementById('previewImage');
        const loadingMessage = document.getElementById('loadingMessage');
        const detectionResult = document.getElementById('detectionResult');

        // Make sure the necessary elements exist before adding the event listener
        if (imageUpload && previewImage && loadingMessage && detectionResult) {
            imageUpload.addEventListener('change', function(event) {
                const file = event.target.files[0];

                if (file) {
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        previewImage.src = e.target.result;
                        previewImage.style.display = 'block';
                        loadingMessage.style.display = 'block';
                        processImage(file);
                    };
                    reader.readAsDataURL(file);
                }
            });

            function processImage(file) {
                const formData = new FormData();
                formData.append('image', file);

                // Replace with the correct backend API endpoint
                fetch('http://127.0.0.1:5000/analyze', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    loadingMessage.style.display = 'none';
                    detectionResult.textContent = data.result;
                    detectionResult.style.display = 'block';
                    console.log('Success:', data);
                })
                .catch(error => {
                    loadingMessage.style.display = 'none';
                    detectionResult.textContent = "Error:" + error;
                    detectionResult.style.display = 'block';
                    console.error('Error:', error);
                });
            }
        } else {
            console.log('One or more elements not found on dashboard.html');
        }
    }
});