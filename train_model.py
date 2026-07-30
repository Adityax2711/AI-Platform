import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, 'AI-Based Hiring Prediction System (2).csv')

df = pd.read_csv(CSV_PATH)
df['Target'] = df['Recruiter Decision'].map({'Hire': 1, 'Reject': 0})

if df['Target'].isnull().any():
    print("Warning: Some rows had unrecognised 'Recruiter Decision' values and will be dropped.")
    df = df.dropna(subset=['Target'])

df['Target'] = df['Target'].astype(int)

le_edu  = LabelEncoder()
le_role = LabelEncoder()
df['Education_Encoded'] = le_edu.fit_transform(df['Education'])
df['Job_Role_Encoded']  = le_role.fit_transform(df['Job Role'])

print("Education classes :", list(le_edu.classes_))
print("Job Role classes  :", list(le_role.classes_))

feature_cols = [
    'Experience (Years)', 'Salary Expectation ($)',
    'Projects Count', 'AI Score (0-100)',
    'Education_Encoded', 'Job_Role_Encoded'
]
X = df[feature_cols]
y = df['Target']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

joblib.dump(model,   os.path.join(BASE_DIR, 'hiring_model.pkl'))
joblib.dump(le_edu,  os.path.join(BASE_DIR, 'le_edu.pkl'))
joblib.dump(le_role, os.path.join(BASE_DIR, 'le_role.pkl'))

print("Model and Encoders saved successfully!")