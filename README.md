# 🚀 AI Hiring Intelligence Platform

[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](#)
[![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python)](#)
[![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-orange)](#)

## 📌 Project Overview
The **AI Hiring Intelligence Platform** is a machine learning-driven web application designed to optimize and assist in the recruitment process. By analyzing candidate data, the system predicts candidate suitability, helping HR professionals and recruiters make data-driven hiring decisions.

**Live Demo:** [AI-Platform on Vercel](https://ai-platform-brown.vercel.app/)

---

## 🛠️ Tech Stack & Architecture

| Component | Technology Used | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | User interface and client-side form validation. |
| **Backend** | Python (Flask/FastAPI) | API routing, model serving, and request handling. |
| **Machine Learning** | Scikit-Learn, Pandas | Data preprocessing, label encoding, and predictive modeling. |
| **Deployment** | Vercel, Ngrok | Cloud hosting (Vercel) and local secure tunneling (Ngrok). |

---

## 📂 Repository Structure

📦 AI-Platform
 ┣ 📂 static/               # CSS, JS, and image assets for the frontend
 ┣ 📂 templates/            # HTML templates for the web interface
 ┣ 📜 AI-Based Hiring Prediction System (2).csv # Core dataset for model training
 ┣ 📜 app.py                # Main backend application server
 ┣ 📜 hiring_model.pkl      # Pre-trained machine learning model
 ┣ 📜 index.html            # Main frontend entry point
 ┣ 📜 le_edu.pkl            # Label Encoder for Education data
 ┣ 📜 le_role.pkl           # Label Encoder for Role data
 ┣ 📜 script.js             # Client-side logic and API integration
 ┣ 📜 script.css            # Custom styling for the application
 ┣ 📜 train_model.py        # ML script for data cleaning and model training
 ┣ 📜 requirements.txt      # Python package dependencies
 ┣ 📜 vercel.json           # Vercel deployment configuration
 ┣ 📜 START_PUBLIC.bat      # Windows batch script for local public launch (Ngrok)
 ┣ 📜 launch.ps1            # PowerShell script for local environment setup
 ┣ 📜 ngrok.exe / .zip      # Executable for secure local tunneling
 ┗ 📜 .gitignore            # Ignored files for Git tracking

 1. Machine Learning Engine
train_model.py: The core analytical script. It ingests the CSV data, handles missing values, applies categorical encoding (saving state to .pkl files), trains the predictive algorithm, and exports the final hiring_model.pkl.

AI-Based Hiring Prediction System (2).csv: The historical training data containing features like candidate experience, education, role applied for, and past project metrics.

*.pkl Files: Serialized Python objects. hiring_model.pkl is the actual brain of the app, while the le_*.pkl files ensure that new user inputs are encoded exactly as the training data was.

2. Application Backend
app.py: Acts as the bridge between the user and the AI. It receives JSON payloads or form data from the frontend, transforms it using the saved label encoders, passes it to the model for inference, and returns the prediction result.

requirements.txt: Ensures environment consistency by locking in the required versions of libraries like scikit-learn, pandas, and the web framework.

3. User Interface
index.html / templates/: The structural layout of the application where recruiters input candidate details.

script.js: Handles asynchronous requests (AJAX/Fetch) to app.py so the page doesn't need to reload when a prediction is requested.

script.css / static/: Ensures the platform is responsive, accessible, and visually professional.

4. Deployment & DevOps
vercel.json: Directs Vercel on how to build and serve the Python backend alongside the static frontend files.

launch.ps1 & START_PUBLIC.bat: Automates the local developer workflow, spinning up the server and utilizing ngrok to generate a temporary public URL for immediate sharing and testing.

⚙️ Local Installation & Setup
To analyze or modify this project locally, follow these steps:

1. Clone the repository:

Bash
git clone [https://github.com/Adityax2711/AI-Platform.git](https://github.com/Adityax2711/AI-Platform.git)
cd AI-Platform
2. Install Dependencies:

Bash
pip install -r requirements.txt
3. Train the Model (Optional):
If you have updated the CSV dataset, retrain the model before starting the server.

Bash
python train_model.py
4. Launch the Server:

Standard Local Launch: python app.py

Automated Public Tunnel (Windows): Run START_PUBLIC.bat
https://ai-platform-brown.vercel.app/
