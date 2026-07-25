import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalService, queueService } from '../services/api';

function AdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [queue, setQueue] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    hospitalService.getAll().then(res => setHospitals(res.data)).catch(console.error);
  }, []);

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
    queueService.getHospitalQueue(hospital.id).then(res => setQueue(res.data)).catch(console.error);
  };

  const handleAdmit = (queueId) => {
    queueService.admit(queueId)
      .then(() => setQueue(queue.filter(q => q.id !== queueId)))
      .catch(() => alert('Failed to admit patient'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>?? Admin Dashboard</span>
          <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-md-4'>
            <h5 className='fw-bold mb-3'>Hospitals</h5>
            {hospitals.map(hospital => (
              <div key={hospital.id} className='card shadow mb-2 p-3' style={{borderRadius: '10px', cursor: 'pointer'}} onClick={() => handleSelectHospital(hospital)}>
                <h6 className='fw-bold text-primary mb-0'>{hospital.name}</h6>
                <small className='text-muted'>{hospital.city}</small>
              </div>
            ))}
          </div>
          <div className='col-md-8'>
            {selectedHospital ? (
              <div>
                <h5 className='fw-bold mb-3'>Queue at {selectedHospital.name}</h5>
                {queue.length === 0 ? (
                  <div className='alert alert-info'>No patients in queue</div>
                ) : (
                  queue.map(q => (
                    <div key={q.id} className='card shadow mb-3 p-3' style={{borderRadius: '10px'}}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <h6 className='fw-bold'>{q.patient.name}</h6>
                          <p className='mb-1 text-muted'>Bed: {q.bedType} | Position: {q.queuePosition}</p>
                          <span className='badge bg-warning text-dark me-2'>{q.priority}</span>
                          <span className='badge bg-success'>{q.status}</span>
                        </div>
                        <button className='btn btn-success btn-sm' onClick={() => handleAdmit(q.id)}>Admit</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className='text-center mt-5'>
                <h5>Select a hospital to view queue</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
