from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import io
import time
import os
from utils import preprocessing

app = Flask(__name__)


@app.route('/analyze', methods=['POST'])
def analyze_image():
    """
    Handles image analysis request from the frontend.
    Returns:
        json: the analysis result.
    """
    try:
        # Check if an image is uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        image_file = request.files['image']

        # Open the image using Pillow
        image = Image.open(io.BytesIO(image_file.read()))

        # Preprocess image
        preprocessed_image = preprocessing.preprocess_image(image)

        # Run prediction
        prediction_result = predict_dummy(preprocessed_image)

        return jsonify({'result': prediction_result}), 200

    except Exception as e:
        print(f"Error: {e}")  # Log the full error for debugging
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

def predict_dummy(image):
    """
    This is a dummy prediction function for demonstration purposes.
    Replace with actual AI model inference.
    Args:
        image(numpy.ndarray): Image array.
    Returns:
        str: The dummy prediction result (Tumor Detected/No Tumor).
    """
    time.sleep(1) # simulates AI processing
    if np.random.random() > 0.5:
        return "Tumor Detected (Dummy)"
    else:
        return "No Tumor (Dummy)"


if __name__ == '__main__':
    app.run(debug=True, port=5000) # you can change port as per requirement