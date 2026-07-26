import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AIPrediction() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: '', gender: 0, temperature: '', spo2: '',
    heartRate: '', bloodPressure: '', disease: 0, emergency: 0
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/ai/predict/priority', {
        age: parseInt(form.age),
        gender: parseInt(form.gender),
        temperature: parseFloat(form.temperature),
        spo2: parseInt(form.spo2),
        heartRate: parseInt(form.heartRate),
        bloodPressure: parseInt(form.bloodPressure),
        disease: parseInt(form.disease),
        emergency: parseInt(form.emergency)
      });
      setResult(response.data);
    } catch (err) {
      alert('Prediction failed. Make sure AI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return '#dc3545';
      case 'HIGH': return '#fd7e14';
      case 'MEDIUM': return '#ffc107';
      case 'LOW': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>AI Priority Prediction</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card shadow p-4' style={{borderRadius: '15px'}}>
              <h5 className='fw-bold text-primary mb-4'>Patient Vitals Form</h5>
              <form onSubmit={handlePredict}>
                <div className='row'>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Age</label>
                    <input type='number' className='form-control' name='age' value={form.age} onChange={handleChange} placeholder='e.g. 45' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Gender</label>
                    <select className='form-control' name='gender' onChange={handleChange}>
                      <option value='1'>Male</option>
                      <option value='0'>Female</option>
                    </select>
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Temperature (C)</label>
                    <input type='number' step='0.1' className='form-control' name='temperature' value={form.temperature} onChange={handleChange} placeholder='e.g. 38.5' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>SpO2 (%)</label>
                    <input type='number' className='form-control' name='spo2' value={form.spo2} onChange={handleChange} placeholder='e.g. 95' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Heart Rate (bpm)</label>
                    <input type='number' className='form-control' name='heartRate' value={form.heartRate} onChange={handleChange} placeholder='e.g. 85' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Blood Pressure</label>
                    <input type='number' className='form-control' name='bloodPressure' value={form.bloodPressure} onChange={handleChange} placeholder='e.g. 120' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Disease Type</label>
                    <select className='form-control' name='disease' onChange={handleChange}>
                      <option value='0'>Fever</option>
                      <option value='1'>Accident</option>
                      <option value='2'>Heart Attack</option>
                      <option value='3'>Fracture</option>
                      <option value='4'>Stroke</option>
                      <option value='5'>Pneumonia</option>
                      <option value='6'>Diabetes</option>
                      <option value='7'>Normal</option>
                    </select>
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Emergency?</label>
                    <select className='form-control' name='emergency' onChange={handleChange}>
                      <option value='0'>No</option>
                      <option value='1'>Yes</option>
                    </select>
                  </div>
                </div>
                <button type='submit' className='btn btn-primary w-100 fw-bold' disabled={loading}>
                  {loading ? 'Predicting...' : 'Predict Priority'}
                </button>
              </form>
            </div>
          </div>
          <div className='col-md-6'>
            {result ? (
              <div className='card shadow p-4 text-center' style={{borderRadius: '15px'}}>
                <h5 className='fw-bold mb-4'>AI Prediction Result</h5>
                <div style={{width: '150px', height: '150px', borderRadius: '50%', background: getPriorityColor(result.priority), margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div>
                    <div style={{color: 'white', fontSize: '18px', fontWeight: 'bold'}}>{result.priority}</div>
                    <div style={{color: 'white', fontSize: '12px'}}>Priority</div>
                  </div>
                </div>
                <h4 className='fw-bold' style={{color: getPriorityColor(result.priority)}}>{result.priority} PRIORITY</h4>
                <p className='text-muted'>AI Confidence: <strong>{result.confidence}%</strong></p>
                <div className='progress mb-3' style={{height: '10px'}}>
                  <div className='progress-bar' style={{width: result.confidence + '%', background: getPriorityColor(result.priority)}}></div>
                </div>
                <div className='alert' style={{background: getPriorityColor(result.priority) + '20', border: '1px solid ' + getPriorityColor(result.priority)}}>
                  {result.priority === 'CRITICAL' && 'Immediate medical attention required!'}
                  {result.priority === 'HIGH' && 'Urgent care needed. Please wait in priority queue.'}
                  {result.priority === 'MEDIUM' && 'Moderate urgency. Will be attended soon.'}
                  {result.priority === 'LOW' && 'Non-urgent case. Please wait for your turn.'}
                </div>
                <button className='btn btn-outline-primary mt-2' onClick={() => navigate('/hospitals')}>Find Hospital</button>
              </div>
            ) : (
              <div className='card shadow p-4 text-center' style={{borderRadius: '15px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                  <div style={{fontSize: '60px'}}>&#129302;</div>
                  <h5 className='text-muted mt-3'>Fill the form to get AI prediction</h5>
                  <p className='text-muted small'>Our AI model will analyze patient vitals and predict priority level</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPrediction;
