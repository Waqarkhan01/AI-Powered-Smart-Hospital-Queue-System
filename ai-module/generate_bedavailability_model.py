import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

np.random.seed(42)
n = 1000

# bed_type: 0=GENERAL, 1=ICU, 2=EMERGENCY, 3=VENTILATOR
bed_type = np.random.randint(0, 4, n)
occupancy_rate = np.round(np.random.uniform(0.1, 1.0, n), 2)
total_beds = np.random.randint(5, 60, n)
queue_count_for_type = np.random.randint(0, 20, n)
hour_of_day = np.random.randint(0, 24, n)

def compute_wait_for_bed(row):
    # base wait depends heavily on occupancy
    base = row['occupancy_rate'] * 90

    # scarcer bed types (ICU, VENTILATOR) take longer to free up
    if row['bed_type'] == 1:  # ICU
        base += 25
    elif row['bed_type'] == 3:  # VENTILATOR
        base += 40
    elif row['bed_type'] == 2:  # EMERGENCY
        base += 10

    # more people waiting for same type increases wait
    base += row['queue_count_for_type'] * 6

    # smaller hospitals (fewer total beds) turn over slower
    if row['total_beds'] < 15:
        base += 15

    # peak hours (admission-heavy) increase wait
    if row['hour_of_day'] in [8, 9, 10, 17, 18, 19]:
        base += 8

    # fully occupied hospitals cap out high
    if row['occupancy_rate'] >= 0.95:
        base += 30

    noise = np.random.normal(0, 5)
    return max(0, round(base + noise))

df = pd.DataFrame({
    'bed_type': bed_type,
    'occupancy_rate': occupancy_rate,
    'total_beds': total_beds,
    'queue_count_for_type': queue_count_for_type,
    'hour_of_day': hour_of_day,
})
df['wait_for_bed'] = df.apply(compute_wait_for_bed, axis=1)

X = df[['bed_type', 'occupancy_rate', 'total_beds', 'queue_count_for_type', 'hour_of_day']]
y = df['wait_for_bed']

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

joblib.dump(model, 'bedavailability_model.pkl')
df.to_csv('bedavailability_data.csv', index=False)

print('Bed availability model trained and saved!')
print('Dataset shape:', df.shape)
print('Sample predictions vs actual:')
sample = X.sample(5, random_state=1)
preds = model.predict(sample)
for i, (idx, row) in enumerate(sample.iterrows()):
    print(f"  Actual: {y[idx]} min, Predicted: {round(preds[i], 1)} min")