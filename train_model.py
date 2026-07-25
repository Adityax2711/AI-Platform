import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# 1. Load dataset (Make sure the CSV is in the same folder)
df = pd.read_csv('AI-Based Hiring Prediction System (2).csv')
df['Target'] = df['Recruiter Decision'].map({'Hire': 1, 'Reject': 0})


# 2. Encode categorical variables
le_edu = LabelEncoder()
le_role = LabelEncoder()
df['Education_Encoded'] = le_edu.fit_transform(df['Education'])
df['Job_Role_Encoded'] = le_role.fit_transform(df['Job Role'])

# 3. Select Features and Target
features = [
    'Experience (Years)', 'Salary Expectation ($)', 
    'Projects Count', 'AI Score (0-100)', 
    'Education_Encoded', 'Job_Role_Encoded'
]
X = df[features]
y = df['Target']

# 4. Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# 5. Save the trained model and encoders
joblib.dump(model, 'hiring_model.pkl')
joblib.dump(le_edu, 'le_edu.pkl')
joblib.dump(le_role, 'le_role.pkl')

print("Model and Encoders saved successfully!")