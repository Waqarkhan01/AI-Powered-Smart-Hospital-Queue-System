from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('priority_model.pkl')
waittime_model = joblib.load('waittime_model.pkl')
bedavailability_model = joblib.load('bedavailability_model.pkl')
diabetes_model = joblib.load('diabetes_risk_model.pkl')
heart_model = joblib.load('heart_risk_model.pkl')

priority_labels = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH', 3: 'CRITICAL'}

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI Service Running', 'model': 'Random Forest Priority Predictor'})

@app.route('/predict/priority', methods=['POST'])
def predict_priority():
    try:
        data = request.get_json()
        features = np.array([[
            data['age'],
            data['gender'],
            data['temperature'],
            data['spo2'],
            data['heartRate'],
            data['bloodPressure'],
            data['disease'],
            data['emergency']
        ]])
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        return jsonify({
            'priority': priority_labels[prediction],
            'priorityCode': int(prediction),
            'confidence': round(float(max(probability)) * 100, 2)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/waittime', methods=['POST'])
def predict_waittime():
    try:
        data = request.get_json()
        queue_count = data.get('queueCount', 0)
        priority_code = data.get('priorityCode', 1)
        hour_of_day = data.get('hourOfDay', 12)
        occupancy_rate = data.get('occupancyRate', 0.5)
        doctors_available = data.get('doctorsAvailable', 3)

        features = np.array([[
            queue_count,
            priority_code,
            hour_of_day,
            occupancy_rate,
            doctors_available
        ]])
        prediction = waittime_model.predict(features)[0]
        return jsonify({'estimatedWaitTime': round(float(prediction)), 'unit': 'minutes'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/bedavailability', methods=['POST'])
def predict_bedavailability():
    try:
        data = request.get_json()
        bed_type_map = {'GENERAL': 0, 'ICU': 1, 'EMERGENCY': 2, 'VENTILATOR': 3}
        bed_type = bed_type_map.get(data.get('bedType', 'GENERAL'), 0)
        occupancy_rate = data.get('occupancyRate', 0.5)
        total_beds = data.get('totalBeds', 20)
        queue_count_for_type = data.get('queueCountForType', 0)
        hour_of_day = data.get('hourOfDay', 12)

        features = np.array([[
            bed_type,
            occupancy_rate,
            total_beds,
            queue_count_for_type,
            hour_of_day
        ]])
        prediction = bedavailability_model.predict(features)[0]
        return jsonify({'estimatedWaitForBed': round(float(prediction)), 'unit': 'minutes'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/diseaserisk', methods=['POST'])
def predict_diseaserisk():
    try:
        data = request.get_json()
        features = np.array([[
            data['age'],
            data['bmi'],
            data['glucose'],
            data['bloodPressure'],
            data['cholesterol'],
            data['smoking'],
            data['familyHistory']
        ]])
        diabetes_proba = diabetes_model.predict_proba(features)[0][1]
        heart_proba = heart_model.predict_proba(features)[0][1]
        return jsonify({
            'diabetesRisk': round(float(diabetes_proba) * 100, 1),
            'heartDiseaseRisk': round(float(heart_proba) * 100, 1)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/recommend/hospital', methods=['POST'])
def recommend_hospital():
    try:
        data = request.get_json()
        hospitals = data.get('hospitals', [])
        priority_code = data.get('priorityCode', 1)
        scored = []
        for h in hospitals:
            score = (h.get('rating', 0) * 20) - (h.get('waitTime', 0) * 0.5)
            if priority_code >= 2:
                score += h.get('availableBeds', 0) * 10
            scored.append({**h, 'score': round(score, 2)})
        scored.sort(key=lambda x: x['score'], reverse=True)
        return jsonify({'recommendations': scored})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)