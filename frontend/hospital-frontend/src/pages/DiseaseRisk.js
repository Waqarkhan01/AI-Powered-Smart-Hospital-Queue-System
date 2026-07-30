import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function DiseaseRisk() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: '', bmi: '', glucose: '', bloodPressure: '',
    cholesterol: '', smoking: 0, familyHistory: 0
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/ai/predict/diseaserisk', {
        age: parseInt(form.age),
        bmi: parseFloat(form.bmi),
        glucose: parseInt(form.glucose),
        bloodPressure: parseInt(form.bloodPressure),
        cholesterol: parseInt(form.cholesterol),
        smoking: parseInt(form.smoking),
        familyHistory: parseInt(form.familyHistory)
      });
      setResult(response.data);
    } catch (err) {
      alert('Prediction failed. Make sure AI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 70) return '#dc3545';
    if (risk >= 40) return '#fd7e14';
    if (risk >= 20) return '#ffc107';
    return '#28a745';
  };

  const getRiskLabel = (risk) => {
    if (risk >= 70) return 'High Risk';
    if (risk >= 40) return 'Moderate Risk';
    if (risk >= 20) return 'Low-Moderate Risk';
    return 'Low Risk';
  };

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>Disease Risk Check</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card shadow p-4' style={{borderRadius: '15px'}}>
              <h5 className='fw-bold text-primary mb-4'>Health Screening Form</h5>
              <form onSubmit={handlePredict}>
                <div className='row'>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Age</label>
                    <input type='number' className='form-control' name='age' value={form.age} onChange={handleChange} placeholder='e.g. 45' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>BMI</label>
                    <input type='number' step='0.1' className='form-control' name='bmi' value={form.bmi} onChange={handleChange} placeholder='e.g. 24.5' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Glucose (mg/dL)</label>
                    <input type='number' className='form-control' name='glucose' value={form.glucose} onChange={handleChange} placeholder='e.g. 100' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Blood Pressure</label>
                    <input type='number' className='form-control' name='bloodPressure' value={form.bloodPressure} onChange={handleChange} placeholder='e.g. 120' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Cholesterol (mg/dL)</label>
                    <input type='number' className='form-control' name='cholesterol' value={form.cholesterol} onChange={handleChange} placeholder='e.g. 190' required />
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Smoking?</label>
                    <select className='form-control' name='smoking' onChange={handleChange}>
                      <option value='0'>No</option>
                      <option value='1'>Yes</option>
                    </select>
                  </div>
                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Family History of Disease?</label>
                    <select className='form-control' name='familyHistory' onChange={handleChange}>
                      <option value='0'>No</option>
                      <option value='1'>Yes</option>
                    </select>
                  </div>
                </div>
                <button type='submit' className='btn btn-primary w-100 fw-bold' disabled={loading}>
                  {loading ? 'Analyzing...' : 'Check My Risk'}
                </button>
              </form>
            </div>
          </div>
          <div className='col-md-6'>
            {result ? (
              <div className='card shadow p-4' style={{borderRadius: '15px'}}>
                <h5 className='fw-bold mb-4 text-center'>Health Risk Assessment</h5>

                <div className='mb-4'>
                  <div className='d-flex justify-content-between mb-1'>
                    <strong>Diabetes Risk</strong>
                    <span style={{color: getRiskColor(result.diabetesRisk), fontWeight: 'bold'}}>{result.diabetesRisk}%</span>
                  </div>
                  <div className='progress mb-1' style={{height: '12px'}}>
                    <div className='progress-bar' style={{width: result.diabetesRisk + '%', background: getRiskColor(result.diabetesRisk)}}></div>
                  </div>
                  <small style={{color: getRiskColor(result.diabetesRisk)}}>{getRiskLabel(result.diabetesRisk)}</small>
                </div>

                <div className='mb-4'>
                  <div className='d-flex justify-content-between mb-1'>
                    <strong>Heart Disease Risk</strong>
                    <span style={{color: getRiskColor(result.heartDiseaseRisk), fontWeight: 'bold'}}>{result.heartDiseaseRisk}%</span>
                  </div>
                  <div className='progress mb-1' style={{height: '12px'}}>
                    <div className='progress-bar' style={{width: result.heartDiseaseRisk + '%', background: getRiskColor(result.heartDiseaseRisk)}}></div>
                  </div>
                  <small style={{color: getRiskColor(result.heartDiseaseRisk)}}>{getRiskLabel(result.heartDiseaseRisk)}</small>
                </div>

                <div className='alert alert-secondary small'>
                  This is an AI-based estimate for informational purposes only. Please consult a doctor for medical advice.
                </div>

                <button className='btn btn-outline-primary mt-2' onClick={() => navigate('/doctors')}>Consult a Doctor</button>
              </div>
            ) : (
              <div className='card shadow p-4 text-center' style={{borderRadius: '15px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                  <div style={{fontSize: '60px'}}>&#129502;</div>
                  <h5 className='text-muted mt-3'>Fill the form to check your health risk</h5>
                  <p className='text-muted small'>Our AI model will estimate diabetes and heart disease risk</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseRisk;