# 🧠 Braimer

This repository contains the code for a brain tumor detection project. The project utilizes a Flask-based backend for processing images and a frontend interface for user interaction.

## 📁 Project Structure

This is the project's directory structure. Note that it differs from previous conversations, please look out for discrepancies:

```
brain-tumor-detection/
├── backend/            # Backend code (Python/Flask)
│   ├── backend.py      # Flask server application
│   ├── model/          # Saved machine learning models
│   │   └── <your_model>.h5 or other model file
│   ├── utils/          # Utility functions
│   │   └── <preprocessing.py, other custom scripts>
│   └── requirements.txt # Required Python libraries
│   
├── data/               # Place to keep image and other related datasets
│   ├── test/           # Place for storing test datasets
│   └── train/          # Place for training datasets
│
├── frontend/           # Frontend code
│   ├── index.html      # User interface main file
│   ├── styles.css      # CSS for design
│   ├── script.js       # Frontend scripting
│   └── assets/         # UI assets (images, etc.)
│
├── docs/               # Documentation files
│   └── README.md
│
├── .gitignore          # Specifies intentionally untracked files
│
└── requirements_dev.txt # Requirements to run dev tools
```

### Key Structure Points:

* **Backend**: Contains the server, model, utility functions, and a list of required dependencies (`requirements.txt`). You need this before starting your server.
* **Frontend**: Handles user interaction using HTML, JavaScript, CSS, and UI assets.
* **Data**: Separates datasets into train and test, making it more user-friendly and avoiding the hassle of using a single directory during testing/training.

## 🚀 Getting Started

### Prerequisites:
Before running, please ensure:

* You have Python 3.7 or higher installed and added to the system path.
* You have Git installed.

### Instructions:
Follow the steps below to set up the development environment:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/gkrishna247/braimer.git
    cd braimer
    ```

2. **Set up the backend:**

    * Navigate to the backend directory:

        ```bash
        cd backend
        ```

    * Install Python dependencies:

        ```bash
        pip install -r requirements.txt
        ```

    * Ensure environment variables are set if needed.

3. **Start the Flask server:**

    * From inside the `backend` directory, run:

        ```bash
        python backend.py
        ```

    **Note**: By default, the server starts at http://127.0.0.1:5000/. If another port is needed, change the port during the run.

4. **Set up the frontend:**

    * No installation required. Use a browser to load `index.html`. Ensure the server is running to load from the endpoint `/analyze` during image prediction.

## 🤝 Contribution

We encourage you to contribute. Before making any large changes to the project, create an issue.

## 📧 Contact

Feel free to contact us at [gkrishna247@gmail.com](mailto:gkrishna247@gmail.com).