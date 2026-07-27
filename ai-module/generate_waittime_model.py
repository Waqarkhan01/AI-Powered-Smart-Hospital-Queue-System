import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

np.random.seed(42)
n = 1000

queue_count = np.random.randint(0, 50, n)
priority_code = np.random.randint(0, 4, n)  # 0=LOW,1=MEDIUM,2=HIGH,3=CRITICAL
hour_of_day = np.random.randint(0, 24, n)
occupancy_rate = np.round(np.random.uniform(0.2, 1.0, n), 2)
doctors_available = np.random.randint(1, 10, n)

def compute_wait(row):
    base = row['queue_count'] * 12

    if row['priority_code'] == 3:
        base = max(2, base - 35)
    elif row['priority_code'] == 2:
        base = max(5, base - 20)
    elif row['priority_code'] == 1:
        base = max(8, base - 8)

    base += row['occupancy_rate'] * 25

    if row['hour_of_day'] in [8, 9, 10, 17, 18, 19]:
        base += 10

    base -= (row['doctors_available'] - 1) * 2

    noise = np.random.normal(0, 4)
    return max(2, round(base + noise))

df = pd.DataFrame({
    'queue_count': queue_count,
    'priority_code': priority_code,
    'hour_of_day': hour_of_day,
    'occupancy_rate': occupancy_rate,
    'doctors_available': doctors_available,
})
df['wait_time'] = df.apply(compute_wait, axis=1)

X = df[['queue_count', 'priority_code', 'hour_of_day', 'occupancy_rate', 'doctors_available']]
y = df['wait_time']

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

joblib.dump(model, 'waittime_model.pkl')
df.to_csv('waittime_data.csv', index=False)

print('Waiting time model trained and saved!')
print('Dataset shape:', df.shape)
print('Sample predictions vs actual:')
sample = X.sample(5, random_state=1)
preds = model.predict(sample)
for i, (idx, row) in enumerate(sample.iterrows()):
    print(f"  Actual: {y[idx]} min, Predicted: {round(preds[i], 1)} min")