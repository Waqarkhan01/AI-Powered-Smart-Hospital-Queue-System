import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { hospitalService, queueService, doctorService, appointmentService, admissionService } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [queue, setQueue] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);

  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '', email: '', phone: '', specialization: '', qualification: '', experienceYears: '', password: ''
  });
  const [addDoctorMsg, setAddDoctorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
    hospitalService.getAll().then(res => setHospitals(res.data)).catch(console.error);
    loadAllAppointmentsForChart();
  }, []);

  const loadAllAppointmentsForChart = () => {
    doctorService.getAll().then(res => {
      const doctorList = res.data;
      Promise.all(doctorList.map(d => appointmentService.getDoctorAppointments(d.id)))
        .then(results => {
          const combined = results.flatMap(r => r.data);
          setAllAppointments(combined);
        })
        .catch(console.error);
    }).catch(console.error);
  };

  const loadDoctors = () => {
    doctorService.getAll().then(res => setDoctors(res.data)).catch(console.error);
  };

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
      .then(() => {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
        loadAllAppointmentsForChart();
      })
      .catch(() => alert('Failed to update appointment'));
  };

  const handleDoctorFormChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setAddDoctorMsg('');
    try {
      await doctorService.register({
        ...doctorForm,
        experienceYears: parseInt(doctorForm.experienceYears) || 0
      });
      setAddDoctorMsg('Doctor added successfully!');
      setDoctorForm({ name: '', email: '', phone: '', specialization: '', qualification: '', experienceYears: '', password: '' });
      loadDoctors();
      setTimeout(() => setShowAddDoctor(false), 1200);
    } catch (err) {
      setAddDoctorMsg('Failed to add doctor. Email may already be registered.');
    }
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

  const statusCounts = { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
  allAppointments.forEach(a => {
    if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
  });

  const chartData = {
    labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    datasets: [{
      data: [statusCounts.PENDING, statusCounts.CONFIRMED, statusCounts.COMPLETED, statusCounts.CANCELLED],
      backgroundColor: ['#ffc107', '#28a745', '#6c757d', '#dc3545'],
    }],
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
        {allAppointments.length > 0 && (
          <div className='row mb-4'>
            <div className='col-md-4'>
              <div className='card shadow p-3' style={{borderRadius: '15px'}}>
                <h6 className='fw-bold text-center mb-3'>Appointments by Status</h6>
                <Pie data={chartData} />
              </div>
            </div>
          </div>
        )}

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
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h5 className='fw-bold mb-0'>Doctors</h5>
              <button className='btn btn-sm btn-primary' onClick={() => setShowAddDoctor(!showAddDoctor)}>
                {showAddDoctor ? 'Cancel' : '+ Add Doctor'}
              </button>
            </div>

            {showAddDoctor && (
              <div className='card shadow p-3 mb-3' style={{borderRadius: '10px'}}>
                {addDoctorMsg && <div className='alert alert-info py-1 px-2 small'>{addDoctorMsg}</div>}
                <form onSubmit={handleAddDoctor}>
                  <input className='form-control form-control-sm mb-2' name='name' placeholder='Full Name' value={doctorForm.name} onChange={handleDoctorFormChange} required />
                  <input className='form-control form-control-sm mb-2' name='email' type='email' placeholder='Email' value={doctorForm.email} onChange={handleDoctorFormChange} required />
                  <input className='form-control form-control-sm mb-2' name='phone' placeholder='Phone' value={doctorForm.phone} onChange={handleDoctorFormChange} />
                  <input className='form-control form-control-sm mb-2' name='specialization' placeholder='Specialization' value={doctorForm.specialization} onChange={handleDoctorFormChange} required />
                  <input className='form-control form-control-sm mb-2' name='qualification' placeholder='Qualification' value={doctorForm.qualification} onChange={handleDoctorFormChange} />
                  <input className='form-control form-control-sm mb-2' name='experienceYears' type='number' placeholder='Experience (years)' value={doctorForm.experienceYears} onChange={handleDoctorFormChange} />
                  <input className='form-control form-control-sm mb-2' name='password' type='password' placeholder='Password' value={doctorForm.password} onChange={handleDoctorFormChange} required />
                  <button type='submit' className='btn btn-success btn-sm w-100'>Register Doctor</button>
                </form>
              </div>
            )}

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