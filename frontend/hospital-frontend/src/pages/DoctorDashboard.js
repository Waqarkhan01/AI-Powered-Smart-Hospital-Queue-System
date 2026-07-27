import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/api';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData && userData.id) {
      appointmentService.getDoctorAppointments(userData.id)
        .then(res => setAppointments(res.data))
        .catch(console.error);
    }
  }, []);

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
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <nav className='navbar navbar-dark' style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>Doctor Dashboard</span>
          <div className='d-flex align-items-center gap-3'>
            <span className='text-white'>Dr. {user?.name}</span>
            <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className='container mt-4'>
        <h5 className='fw-bold mb-3 text-secondary'>My Appointments</h5>
        {appointments.length === 0 ? (
          <div className='alert alert-info'>No appointments yet.</div>
        ) : (
          <div className='row'>
            {appointments.map(appt => (
              <div key={appt.id} className='col-md-6 mb-3'>
                <div className='card shadow p-3' style={{ borderRadius: '12px' }}>
                  <h6 className='fw-bold'>{appt.patient?.name}</h6>
                  <p className='mb-1 text-muted'>{appt.appointmentDate} at {appt.appointmentTime}</p>
                  <p className='mb-2 text-muted small'>{appt.reason}</p>
                  <span className={'badge ' + getStatusColor(appt.status) + ' mb-2'} style={{width: 'fit-content'}}>{appt.status}</span>
                  <div className='d-flex gap-2 mt-2'>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;