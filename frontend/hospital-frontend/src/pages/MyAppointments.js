import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentService } from '../services/api';

function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      appointmentService.getPatientAppointments(user.id)
        .then(res => setAppointments(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.updateStatus(id, 'CANCELLED');
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
      toast.success('Appointment cancelled successfully!');
    } catch (err) {
      toast.error('Failed to cancel appointment.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'COMPLETED': return '#6c757d';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <nav className='navbar navbar-dark' style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>My Appointments</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>

      <div className='container mt-4'>
        {loading ? (
          <div className='text-center mt-5'>
            <div className='spinner-border text-primary' role='status'></div>
          </div>
        ) : appointments.length === 0 ? (
          <p className='text-muted'>No appointments yet. Book one from the Doctors page.</p>
        ) : (
          <div className='row'>
            {appointments.map(appt => (
              <div key={appt.id} className='col-md-6 mb-3'>
                <div className='card shadow p-3' style={{ borderRadius: '12px', borderLeft: '5px solid ' + getStatusColor(appt.status) }}>
                  <h5 className='fw-bold text-primary'>{appt.doctor?.name}</h5>
                  <p className='text-muted mb-1'>{appt.doctor?.specialization}</p>
                  <p className='mb-1'><strong>Date:</strong> {appt.appointmentDate}</p>
                  <p className='mb-1'><strong>Time:</strong> {appt.appointmentTime}</p>
                  <p className='mb-2'><strong>Status:</strong> <span style={{ color: getStatusColor(appt.status) }}>{appt.status}</span></p>
                  {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                    <button className='btn btn-outline-danger btn-sm' onClick={() => handleCancel(appt.id)}>
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;