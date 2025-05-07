// script.js

// Utility: Get element by ID (shorter, safer)
function $(id) {
    return document.getElementById(id);
}

// Login Function
function login() {
    const email = $('login-email')?.value.trim();
    const password = $('login-password')?.value;
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    fetch('https://testflaskapp-324856786088.asia-south1.run.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'dashboard.html';
        } else {
            // Attempt to parse error message from backend if available
            response.json().then(errData => {
                alert(errData.message || 'Invalid credentials');
            }).catch(() => {
                alert('Invalid credentials');
            });
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
    root.classList.toggle('light-theme');
    localStorage.setItem('theme', root.classList.contains('light-theme') ? 'light' : 'dark');
}

// Apply saved theme on load
(function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        // Assuming dark is default if not 'light' or no theme saved
        document.documentElement.classList.remove('light-theme');
    }
})();

// DOMContentLoaded event for all page-specific logic
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Highlight (optimized)
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        // Check if link.getAttribute('href') is not null or empty before calling endsWith
        const href = link.getAttribute('href');
        if (href && window.location.pathname.endsWith(href)) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        }
        link.addEventListener('click', (e) => { // Added 'e' parameter
            // Check if it's an internal link before removing active from others
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                // Smooth scroll handles active state for anchors if needed or do it here
            } else {
                // For page navigation
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Smooth Scroll for Navigation Links (skip external links)
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Animation on Scroll (IntersectionObserver)
    const features = document.querySelectorAll('.feature');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target); // Optional: stop observing once animated
                }
            });
        }, { threshold: 0.5 });
        features.forEach(feature => observer.observe(feature));
    } else {
        // Fallback: add animate class immediately
        features.forEach(feature => feature.classList.add('animate'));
    }

    // Dashboard page logic
    if (window.location.pathname.endsWith('dashboard.html')) {
        const imageUpload = $('imageUpload');
        const previewImage = $('previewImage');
        const loadingMessage = $('loadingMessage');
        const detectionResultElement = $('detectionResult'); // Renamed to avoid conflict
        const historyList = $('historyList');

        if (imageUpload && previewImage && loadingMessage && detectionResultElement) {
            imageUpload.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    // Validate file type (optional, but good practice)
                    if (!file.type.startsWith('image/')) {
                        alert('Please upload a valid image file (e.g., JPG, PNG).');
                        previewImage.style.display = 'none';
                        detectionResultElement.style.display = 'none';
                        loadingMessage.style.display = 'none';
                        imageUpload.value = ''; // Reset file input
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImage.src = e.target.result;
                        previewImage.style.display = 'block';
                        detectionResultElement.style.display = 'none'; // Hide previous result
                        loadingMessage.style.display = 'block'; // Show loading
                        processImage(file);
                    };
                    reader.readAsDataURL(file);
                } else {
                    previewImage.style.display = 'none';
                    detectionResultElement.style.display = 'none';
                    loadingMessage.style.display = 'none';
                }
            });

            function processImage(file) {
                const formData = new FormData();
                formData.append('image', file);

                fetch('https://testflaskapp-324856786088.asia-south1.run.app/analyze', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    // Regardless of ok status, try to parse JSON, as backend might send error details in JSON
                    return response.json().then(data => ({ ok: response.ok, status: response.status, data }));
                })
                .then(({ ok, status, data }) => {
                    loadingMessage.style.display = 'none';
                    if (ok) {
                        // --- MODIFICATION START ---
                        detectionResultElement.textContent = data.message; // Use data.message
                        // Optionally, style based on data.has_tumor
                        if (data.has_tumor === true) {
                            detectionResultElement.style.color = 'red'; // Example: make tumor text red
                        } else if (data.has_tumor === false) {
                            detectionResultElement.style.color = 'green'; // Example: make no tumor text green
                        } else {
                            detectionResultElement.style.color = ''; // Reset color
                        }

                        detectionResultElement.style.display = 'block';

                        if (historyList && data.message) { // Use data.message for history
                            const li = document.createElement('li');
                            li.textContent = new Date().toLocaleString() + ': ' + data.message;
                            historyList.prepend(li); // Adds to the beginning of the list
                        }
                        // --- MODIFICATION END ---
                    } else {
                        // Handle HTTP errors (4xx, 5xx) where backend sent a JSON error message
                        detectionResultElement.textContent = `Error: ${data.error || `Analysis failed (status ${status})`}`;
                        detectionResultElement.style.color = 'orange';
                        detectionResultElement.style.display = 'block';
                        console.error('Analysis error from backend:', data);
                    }
                })
                .catch(error => { // Catches network errors or if .json() fails
                    loadingMessage.style.display = 'none';
                    detectionResultElement.textContent = 'Error: Could not connect to the server or an unexpected error occurred. ' + error.message;
                    detectionResultElement.style.color = 'orange';
                    detectionResultElement.style.display = 'block';
                    console.error('Fetch Error:', error);
                });
            }
        }
    }

    // Contact form validation
    const contactForm = document.querySelector('form[aria-label="Contact form"]');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('name')?.value.trim();
            const email = $('email')?.value.trim();
            const message = $('message')?.value.trim();
            if (!name || !email || !message) {
                alert('Please fill out all fields.');
                return;
            }
            // Here you would typically send the form data to a backend
            alert('Thank you for your message! (This is a demo, data not sent)');
            contactForm.reset();
        });
    }
});