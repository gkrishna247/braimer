document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('previewImage').style.display = 'block';
             // Show loading message when image is uploaded
            document.getElementById('loadingMessage').style.display = 'block';
             processImage(file);
        }
        reader.readAsDataURL(file);
    }
});

function processImage(file){
    const formData = new FormData();
    formData.append('image', file);
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
        // Hide loading message and display results
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('detectionResult').textContent = data.result;
        document.getElementById('detectionResult').style.display = 'block';
        console.log('Success:', data);
    })
    .catch(error => {
            // Hide loading message and display error
            document.getElementById('loadingMessage').style.display = 'none';
            document.getElementById('detectionResult').textContent = "Error:" + error;
            document.getElementById('detectionResult').style.display = 'block';
        console.error('Error:', error);
    });
}