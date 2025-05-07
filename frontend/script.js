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
    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    root.classList.toggle('light-theme');
    localStorage.setItem('theme', root.classList.contains('light-theme') ? 'light' : 'dark');
}

// Apply saved theme on load
(function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
})();

// DOMContentLoaded event for all page-specific logic
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Highlight (optimized)
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
        const detectionResult = $('detectionResult');
        const historyList = $('historyList');

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
                fetch('http://127.0.0.1:5000/analyze', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);
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
                })
                .catch(error => {
                    loadingMessage.style.display = 'none';
                    detectionResult.textContent = 'Error: ' + error;
                    detectionResult.style.display = 'block';
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
            alert('Thank you for your message!');
            contactForm.reset();
        });
    }
});