import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalService, bedService, queueService } from '../services/api';
import api from '../services/api';

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [beds, setBeds] = useState([]);
  const [bedEstimates, setBedEstimates] = useState([]);
  const [estimatesLoading, setEstimatesLoading] = useState(false);
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
    setBedEstimates([]);
    bedService.getAvailable(hospital.id).then(res => setBeds(res.data)).catch(console.error);
    loadBedEstimates(hospital.id);
  };

  const loadBedEstimates = async (hospitalId) => {
    setEstimatesLoading(true);
    try {
      const [allBedsRes, queueRes] = await Promise.all([
        bedService.getByHospital(hospitalId),
        queueService.getHospitalQueue(hospitalId)
      ]);

      const allBeds = allBedsRes.data;
      const queue = queueRes.data;
      const hourOfDay = new Date().getHours();

      const bedTypes = [...new Set(allBeds.map(b => b.bedType))];

      const estimates = await Promise.all(bedTypes.map(async (bedType) => {
        const bedsOfType = allBeds.filter(b => b.bedType === bedType);
        const totalBeds = bedsOfType.length;
        const occupiedCount = bedsOfType.filter(b => b.status === 'OCCUPIED').length;
        const availableCount = bedsOfType.filter(b => b.status === 'AVAILABLE').length;
        const occupancyRate = totalBeds > 0 ? occupiedCount / totalBeds : 0;
        const queueCountForType = queue.filter(q => q.bedType === bedType).length;

        try {
          const res = await api.post('/ai/predict/bedavailability', {
            bedType,
            occupancyRate,
            totalBeds,
            queueCountForType,
            hourOfDay
          });
          return {
            bedType,
            availableCount,
            totalBeds,
            estimatedWaitForBed: res.data.estimatedWaitForBed
          };
        } catch (err) {
          return { bedType, availableCount, totalBeds, estimatedWaitForBed: null };
        }
      }));

      setBedEstimates(estimates);
    } catch (err) {
      console.error(err);
    } finally {
      setEstimatesLoading(false);
    }
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
          <span className='navbar-brand fw-bold'>Hospitals</span>
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
                <p className='text-muted mb-1'>{hospital.address}, {hospital.city}</p>
                <p className='text-muted mb-1'>Rating: {hospital.rating}</p>
                <p className='text-muted mb-0'>{hospital.phone}</p>
              </div>
            ))}
          </div>
          <div className='col-md-6'>
            {selectedHospital && (
              <div>
                <h5 className='fw-bold mb-3'>Bed Availability Estimates</h5>
                {estimatesLoading ? (
                  <div className='spinner-border text-primary' style={{width: '2rem', height: '2rem'}}></div>
                ) : (
                  bedEstimates.map(est => (
                    <div key={est.bedType} className='card shadow mb-2 p-3' style={{borderRadius: '10px'}}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <h6 className='fw-bold mb-1'>{est.bedType}</h6>
                          <small className='text-muted'>{est.availableCount} / {est.totalBeds} available now</small>
                        </div>
                        {est.availableCount > 0 ? (
                          <span className='badge bg-success'>Available Now</span>
                        ) : est.estimatedWaitForBed !== null ? (
                          <span className='badge bg-warning text-dark'>~{est.estimatedWaitForBed} min wait</span>
                        ) : (
                          <span className='badge bg-secondary'>N/A</span>
                        )}
                      </div>
                    </div>
                  ))
                )}

                <h5 className='fw-bold mb-3 mt-4'>Available Beds at {selectedHospital.name}</h5>
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