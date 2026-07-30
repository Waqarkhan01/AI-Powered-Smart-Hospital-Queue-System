import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

np.random.seed(42)
n = 1000

age = np.random.randint(18, 85, n)
bmi = np.round(np.random.uniform(16, 42, n), 1)
glucose = np.random.randint(70, 220, n)
blood_pressure = np.random.randint(90, 180, n)
cholesterol = np.random.randint(120, 320, n)
smoking = np.random.randint(0, 2, n)          # 0 = No, 1 = Yes
family_history = np.random.randint(0, 2, n)   # 0 = No, 1 = Yes

def diabetes_label(row):
    score = 0
    if row['glucose'] > 140: score += 3
    elif row['glucose'] > 110: score += 1
    if row['bmi'] > 30: score += 2
    elif row['bmi'] > 25: score += 1
    if row['age'] > 45: score += 1
    if row['family_history'] == 1: score += 2
    return 1 if score >= 4 else 0

def heart_label(row):
    score = 0
    if row['blood_pressure'] > 140: score += 2
    elif row['blood_pressure'] > 130: score += 1
    if row['cholesterol'] > 240: score += 2
    elif row['cholesterol'] > 200: score += 1
    if row['smoking'] == 1: score += 2
    if row['age'] > 50: score += 1
    if row['family_history'] == 1: score += 2
    return 1 if score >= 4 else 0

df = pd.DataFrame({
    'age': age,
    'bmi': bmi,
    'glucose': glucose,
    'blood_pressure': blood_pressure,
    'cholesterol': cholesterol,
    'smoking': smoking,
    'family_history': family_history,
})
df['diabetes'] = df.apply(diabetes_label, axis=1)
df['heart_disease'] = df.apply(heart_label, axis=1)

features = ['age', 'bmi', 'glucose', 'blood_pressure', 'cholesterol', 'smoking', 'family_history']
X = df[features]

diabetes_model = RandomForestClassifier(n_estimators=100, random_state=42)
diabetes_model.fit(X, df['diabetes'])

heart_model = RandomForestClassifier(n_estimators=100, random_state=42)
heart_model.fit(X, df['heart_disease'])

joblib.dump(diabetes_model, 'diabetes_risk_model.pkl')
joblib.dump(heart_model, 'heart_risk_model.pkl')
df.to_csv('diseaserisk_data.csv', index=False)

print('Disease risk models trained and saved!')
print('Dataset shape:', df.shape)
print('Diabetes positive rate:', df['diabetes'].mean())
print('Heart disease positive rate:', df['heart_disease'].mean())

print('\nSample predictions:')
sample = X.sample(5, random_state=1)
d_proba = diabetes_model.predict_proba(sample)[:, 1]
h_proba = heart_model.predict_proba(sample)[:, 1]
for i, idx in enumerate(sample.index):
    print(f"  Diabetes risk: {round(d_proba[i]*100,1)}%, Heart risk: {round(h_proba[i]*100,1)}%")