import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { admissionService } from '../services/api';

function MyAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      admissionService.getPatientAdmissions(user.id)
        .then(res => { setAdmissions(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'ADMITTED': return 'success';
      case 'RELEASED': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>My Admissions</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>
      <div className='container mt-4'>
        {loading ? (
          <div className='text-center mt-5'><div className='spinner-border text-primary'></div></div>
        ) : admissions.length === 0 ? (
          <div className='text-center mt-5'>
            <h5 className='text-muted'>No admissions found</h5>
            <button className='btn btn-primary mt-3' onClick={() => navigate('/hospitals')}>Find Hospital</button>
          </div>
        ) : (
          admissions.map(admission => (
            <div key={admission.id} className='card shadow mb-3 p-4' style={{borderRadius: '15px'}}>
              <div className='row align-items-center'>
                <div className='col-md-8'>
                  <h5 className='fw-bold text-primary'>{admission.hospital?.name}</h5>
                  <p className='text-muted mb-1'>Address: {admission.hospital?.address}, {admission.hospital?.city}</p>
                  <p className='text-muted mb-1'>Admitted On: <strong>{new Date(admission.admittedOn).toLocaleDateString()}</strong></p>
                  {admission.releasedOn && (
                    <p className='text-muted mb-1'>Released On: <strong>{new Date(admission.releasedOn).toLocaleDateString()}</strong></p>
                  )}
                  {admission.diagnosis && (
                    <p className='text-muted mb-0'>Diagnosis: {admission.diagnosis}</p>
                  )}
                </div>
                <div className='col-md-4 text-end'>
                  <span className={'badge bg-' + getStatusColor(admission.status) + ' p-2'} style={{fontSize: '14px'}}>
                    {admission.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyAdmissions;
