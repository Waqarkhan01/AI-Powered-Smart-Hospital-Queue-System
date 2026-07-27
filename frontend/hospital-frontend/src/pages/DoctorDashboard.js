import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentService } from '../services/api';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData && userData.id) {
      appointmentService.getDoctorAppointments(userData.id)
        .then(res => { setAppointments(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      setAppointments(appointments.map(a => a.id === id ? {...a, status} : a));
      toast.success('Appointment status updated!');
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'secondary';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>Doctor Dashboard</span>
          <div className='d-flex align-items-center gap-3'>
            <span className='text-white'>{user?.name}</span>
            <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className='container mt-4'>
        <div className='row mb-4'>
          <div className='col-md-4 mb-3'>
            <div className='card shadow text-center p-3' style={{borderRadius: '15px', borderLeft: '5px solid #11998e'}}>
              <h3 className='fw-bold' style={{color: '#11998e'}}>{appointments.length}</h3>
              <p className='text-muted mb-0'>Total Appointments</p>
            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card shadow text-center p-3' style={{borderRadius: '15px', borderLeft: '5px solid #ffc107'}}>
              <h3 className='text-warning fw-bold'>{appointments.filter(a => a.status === 'PENDING').length}</h3>
              <p className='text-muted mb-0'>Pending</p>
            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card shadow text-center p-3' style={{borderRadius: '15px', borderLeft: '5px solid #28a745'}}>
              <h3 className='text-success fw-bold'>{appointments.filter(a => a.status === 'CONFIRMED').length}</h3>
              <p className='text-muted mb-0'>Confirmed</p>
            </div>
          </div>
        </div>
        <h5 className='fw-bold mb-3 text-secondary'>My Appointments</h5>
        {loading ? (
          <div className='text-center mt-5'><div className='spinner-border' style={{color: '#11998e'}}></div></div>
        ) : appointments.length === 0 ? (
          <div className='text-center mt-5'>
            <h5 className='text-muted'>No appointments yet</h5>
          </div>
        ) : (
          appointments.map(appt => (
            <div key={appt.id} className='card shadow mb-3 p-4' style={{borderRadius: '15px'}}>
              <div className='row align-items-center'>
                <div className='col-md-7'>
                  <h5 className='fw-bold text-primary'>{appt.patient?.name}</h5>
                  <p className='text-muted mb-1'>Email: {appt.patient?.email}</p>
                  <p className='text-muted mb-1'>Date: <strong>{appt.appointmentDate}</strong></p>
                  <p className='text-muted mb-1'>Time: <strong>{appt.appointmentTime}</strong></p>
                  <p className='text-muted mb-0'>Reason: {appt.reason}</p>
                </div>
                <div className='col-md-5 text-end'>
                  <span className={'badge bg-' + getStatusColor(appt.status) + ' mb-3 p-2'} style={{fontSize: '13px'}}>{appt.status}</span>
                  <div className='d-flex gap-2 justify-content-end flex-wrap'>
                    {appt.status === 'PENDING' && (
                      <button className='btn btn-success btn-sm' onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}>Confirm</button>
                    )}
                    {appt.status === 'CONFIRMED' && (
                      <button className='btn btn-secondary btn-sm' onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}>Mark Complete</button>
                    )}
                    {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                      <button className='btn btn-danger btn-sm' onClick={() => handleUpdateStatus(appt.id, 'CANCELLED')}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
