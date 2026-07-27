import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { admissionService } from '../services/api';

function MyAdmissions() {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      admissionService.getPatientAdmissions(user.id)
        .then(res => setAdmissions(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <nav className='navbar navbar-dark' style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>My Admissions</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>

      <div className='container mt-4'>
        {loading ? (
          <p>Loading admissions...</p>
        ) : admissions.length === 0 ? (
          <p className='text-muted'>No admission history yet.</p>
        ) : (
          <div className='row'>
            {admissions.map(a => (
              <div key={a.id} className='col-md-6 mb-3'>
                <div className='card shadow p-3' style={{ borderRadius: '12px', borderLeft: '5px solid ' + (a.status === 'ADMITTED' ? '#28a745' : '#6c757d') }}>
                  <h5 className='fw-bold text-primary'>{a.hospital?.name}</h5>
                  <p className='text-muted mb-1'>Bed: {a.bed?.bedNumber || 'Not assigned'}</p>
                  <p className='mb-1'><strong>Admitted:</strong> {new Date(a.admittedOn).toLocaleString()}</p>
                  {a.releasedOn && (
                    <p className='mb-1'><strong>Released:</strong> {new Date(a.releasedOn).toLocaleString()}</p>
                  )}
                  {a.diagnosis && <p className='mb-1'><strong>Diagnosis:</strong> {a.diagnosis}</p>}
                  <span className={'badge ' + (a.status === 'ADMITTED' ? 'bg-success' : 'bg-secondary')} style={{width: 'fit-content'}}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAdmissions;