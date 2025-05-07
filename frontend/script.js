// script.js

// Login Function
function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login.');
    });
}

// Theme Toggle Function
function toggleTheme() {
    const root = document.documentElement;
    if (root.classList.contains('light-theme')) {
        root.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        root.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }
}

(function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
    }
})();

// Event listener for dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on dashboard.html to avoid errors on other pages
    if (window.location.pathname.endsWith('dashboard.html')) {
        const imageUpload = document.getElementById('imageUpload');
        const previewImage = document.getElementById('previewImage');
        const loadingMessage = document.getElementById('loadingMessage');
        const detectionResult = document.getElementById('detectionResult');
        const historyList = document.getElementById('historyList');

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
                    if (historyList && data.result) {
                        const li = document.createElement('li');
                        li.textContent = new Date().toLocaleString() + ': ' + data.result;
                        historyList.prepend(li);
                    }
                    console.log('Success:', data);
                })
                .catch(error => {
                    loadingMessage.style.display = 'none';
                    detectionResult.textContent = "Error: " + error;
                    detectionResult.style.display = 'block';
                    console.error('Error:', error);
                });
            }
        } else {
            console.log('One or more elements not found on dashboard.html');
        }
    }

    // Navigation Highlight
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.href && window.location.pathname.endsWith(link.getAttribute('href'))) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        }
        link.addEventListener('click', () => {
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animation on Scroll
    const features = document.querySelectorAll('.feature');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.5
    });

    features.forEach(feature => {
        observer.observe(feature);
    });

    // Form Validation
    const contactForm = document.querySelector('form[aria-label="Contact form"]');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill out all fields.');
                return;
            }

            alert('Thank you for your message!');
            contactForm.reset();
        });
    }
});