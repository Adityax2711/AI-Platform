import os
from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model  = joblib.load(os.path.join(BASE_DIR, 'hiring_model.pkl'))
le_edu = joblib.load(os.path.join(BASE_DIR, 'le_edu.pkl'))
le_role = joblib.load(os.path.join(BASE_DIR, 'le_role.pkl'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
  
    data = request.json

    if not data:
        return jsonify({'error': 'No JSON data received'}), 400

    try:
        experience = float(data['experience'])
        salary     = float(data['salary'])
        projects   = float(data['projects'])
        ai_score   = float(data['ai_score'])
        education  = data['education']
        job_role   = data['job_role']

        if education not in le_edu.classes_:
            return jsonify({'error': f"Unknown education value '{education}'. "
                                     f"Valid options: {list(le_edu.classes_)}"}), 400

        if job_role not in le_role.classes_:
            return jsonify({'error': f"Unknown job role '{job_role}'. "
                                     f"Valid options: {list(le_role.classes_)}"}), 400

        education_encoded = le_edu.transform([education])[0]
        job_role_encoded  = le_role.transform([job_role])[0]

        features = [[experience, salary, projects, ai_score,
                     education_encoded, job_role_encoded]]

        prediction = model.predict(features)[0]
        result = "Hired" if prediction == 1 else "Rejected"

        return jsonify({'prediction': result})

    except KeyError as e:
        return jsonify({'error': f'Missing field: {e}'}), 400
    except ValueError as e:
        return jsonify({'error': f'Invalid value: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)