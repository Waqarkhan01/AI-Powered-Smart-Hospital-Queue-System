import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000

diseases = ['Fever', 'Accident', 'Heart Attack', 'Fracture', 'Stroke', 'Pneumonia', 'Diabetes', 'Normal']
genders = ['Male', 'Female']

data = {
    'age': np.random.randint(1, 90, n),
    'gender': np.random.choice([0, 1], n),
    'temperature': np.round(np.random.uniform(36.0, 40.5, n), 1),
    'spo2': np.random.randint(85, 100, n),
    'heart_rate': np.random.randint(50, 130, n),
    'blood_pressure': np.random.randint(80, 180, n),
    'disease': np.random.randint(0, 8, n),
    'emergency': np.random.randint(0, 2, n),
}

df = pd.DataFrame(data)

def assign_priority(row):
    score = 0
    if row['emergency'] == 1: score += 3
    if row['spo2'] < 90: score += 3
    if row['temperature'] > 39.5: score += 2
    if row['heart_rate'] > 110 or row['heart_rate'] < 55: score += 2
    if row['blood_pressure'] > 160: score += 2
    if row['age'] > 70 or row['age'] < 5: score += 1
    if score >= 7: return 3
    elif score >= 4: return 2
    elif score >= 2: return 1
    else: return 0

df['priority'] = df.apply(assign_priority, axis=1)
df.to_csv('patient_data.csv', index=False)
print('Dataset generated! Shape:', df.shape)
print(df['priority'].value_counts())
