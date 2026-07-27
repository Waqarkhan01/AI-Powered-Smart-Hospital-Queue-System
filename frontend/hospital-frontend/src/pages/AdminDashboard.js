import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalService, queueService, doctorService, appointmentService, admissionService } from '../services/api';

function AdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [queue, setQueue] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    hospitalService.getAll().then(res => setHospitals(res.data)).catch(console.error);
    doctorService.getAll().then(res => setDoctors(res.data)).catch(console.error);
  }, []);

  const loadHospitalData = (hospital) => {
    queueService.getHospitalQueue(hospital.id).then(res => setQueue(res.data)).catch(console.error);
    admissionService.getHospitalAdmissions(hospital.id)
      .then(res => setAdmissions(res.data.filter(a => a.status === 'ADMITTED')))
      .catch(console.error);
  };

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
    loadHospitalData(hospital);
  };

  const handleAdmit = (queueId) => {
    queueService.admit(queueId)
      .then(() => {
        setQueue(queue.filter(q => q.id !== queueId));
        loadHospitalData(selectedHospital);
      })
      .catch((err) => alert(err.response?.data || 'Failed to admit patient'));
  };

  const handleRelease = (admissionId) => {
    admissionService.release(admissionId)
      .then(() => setAdmissions(admissions.filter(a => a.id !== admissionId)))
      .catch(() => alert('Failed to release patient'));
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    appointmentService.getDoctorAppointments(doctor.id).then(res => setAppointments(res.data)).catch(console.error);
  };

  const handleUpdateStatus = (id, status) => {
    appointmentService.updateStatus(id, status)
      .then(() => setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a)))
      .catch(() => alert('Failed to update appointment'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-success';
      case 'PENDING': return 'bg-warning text-dark';
      case 'COMPLETED': return 'bg-secondary';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>Admin Dashboard</span>
          <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className='container mt-4'>
        <div className='row mb-5'>
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

                <h5 className='fw-bold mb-3 mt-4'>Current Admissions</h5>
                {admissions.length === 0 ? (
                  <div className='alert alert-info'>No patients currently admitted</div>
                ) : (
                  admissions.map(a => (
                    <div key={a.id} className='card shadow mb-3 p-3' style={{borderRadius: '10px'}}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <h6 className='fw-bold'>{a.patient?.name}</h6>
                          <p className='mb-1 text-muted'>Bed: {a.bed?.bedNumber || 'N/A'}</p>
                          <p className='mb-0 text-muted small'>Admitted: {new Date(a.admittedOn).toLocaleString()}</p>
                        </div>
                        <button className='btn btn-outline-danger btn-sm' onClick={() => handleRelease(a.id)}>Release</button>
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

        <hr />

        <div className='row mt-4'>
          <div className='col-md-4'>
            <h5 className='fw-bold mb-3'>Doctors</h5>
            {doctors.length === 0 ? (
              <p className='text-muted'>No doctors registered yet.</p>
            ) : (
              doctors.map(doctor => (
                <div key={doctor.id} className='card shadow mb-2 p-3' style={{borderRadius: '10px', cursor: 'pointer'}} onClick={() => handleSelectDoctor(doctor)}>
                  <h6 className='fw-bold text-primary mb-0'>{doctor.name}</h6>
                  <small className='text-muted'>{doctor.specialization}</small>
                </div>
              ))
            )}
          </div>
          <div className='col-md-8'>
            {selectedDoctor ? (
              <div>
                <h5 className='fw-bold mb-3'>Appointments for {selectedDoctor.name}</h5>
                {appointments.length === 0 ? (
                  <div className='alert alert-info'>No appointments for this doctor</div>
                ) : (
                  appointments.map(appt => (
                    <div key={appt.id} className='card shadow mb-3 p-3' style={{borderRadius: '10px'}}>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <h6 className='fw-bold'>{appt.patient?.name}</h6>
                          <p className='mb-1 text-muted'>{appt.appointmentDate} at {appt.appointmentTime}</p>
                          <p className='mb-1 text-muted small'>{appt.reason}</p>
                          <span className={'badge ' + getStatusColor(appt.status)}>{appt.status}</span>
                        </div>
                        <div className='d-flex gap-2'>
                          {appt.status === 'PENDING' && (
                            <button className='btn btn-success btn-sm' onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}>Confirm</button>
                          )}
                          {appt.status === 'CONFIRMED' && (
                            <button className='btn btn-secondary btn-sm' onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}>Complete</button>
                          )}
                          {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                            <button className='btn btn-outline-danger btn-sm' onClick={() => handleUpdateStatus(appt.id, 'CANCELLED')}>Cancel</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className='text-center mt-5'>
                <h5>Select a doctor to view their appointments</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;