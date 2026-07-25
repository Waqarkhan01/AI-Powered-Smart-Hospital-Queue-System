import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalService, bedService, queueService } from '../services/api';

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    hospitalService.getAll()
      .then(res => { setHospitals(res.data); setLoading(false); })
      .catch(console.error);
  }, []);

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
    bedService.getAvailable(hospital.id).then(res => setBeds(res.data)).catch(console.error);
  };

  const handleJoinQueue = (bedType) => {
    queueService.join(user.id, selectedHospital.id, bedType, 'MEDIUM')
      .then(() => { alert('Successfully joined queue!'); navigate('/queue'); })
      .catch(() => alert('Failed to join queue'));
  };

  if (loading) return <div className='text-center mt-5'><div className='spinner-border text-primary'></div></div>;

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>?? Hospitals</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>
      <div className='container mt-4'>
        <div className='row'>
          <div className='col-md-6'>
            <h5 className='fw-bold mb-3'>Available Hospitals</h5>
            {hospitals.map(hospital => (
              <div key={hospital.id} className='card shadow mb-3 p-3' style={{borderRadius: '10px', cursor: 'pointer', border: selectedHospital?.id === hospital.id ? '2px solid #667eea' : 'none'}} onClick={() => handleSelectHospital(hospital)}>
                <h6 className='fw-bold text-primary'>{hospital.name}</h6>
                <p className='text-muted mb-1'>?? {hospital.address}, {hospital.city}</p>
                <p className='text-muted mb-1'>? Rating: {hospital.rating}</p>
                <p className='text-muted mb-0'>?? {hospital.phone}</p>
              </div>
            ))}
          </div>
          <div className='col-md-6'>
            {selectedHospital && (
              <div>
                <h5 className='fw-bold mb-3'>Available Beds at {selectedHospital.name}</h5>
                {beds.length === 0 ? (
                  <div className='alert alert-warning'>No beds available</div>
                ) : (
                  beds.map(bed => (
                    <div key={bed.id} className='card shadow mb-3 p-3' style={{borderRadius: '10px'}}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <h6 className='fw-bold'>{bed.bedNumber}</h6>
                          <span className='badge bg-success'>{bed.bedType}</span>
                        </div>
                        <button className='btn btn-primary btn-sm' onClick={() => handleJoinQueue(bed.bedType)}>Join Queue</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalList;
