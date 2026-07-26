import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService, appointmentService } from '../services/api';

function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    doctorService.getAll()
      .then(res => setDoctors(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async (doctorId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      setMessage('Please log in again.');
      return;
    }
    setBookingId(doctorId);
    try {
      await appointmentService.book(user.id, doctorId, {
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: '10:00:00',
        reason: 'General consultation'
      });
      setMessage('Appointment requested successfully!');
    } catch (err) {
      setMessage('Failed to book appointment.');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <nav className='navbar navbar-dark' style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>Doctors</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>

      <div className='container mt-4'>
        {message && <div className='alert alert-info'>{message}</div>}

        {loading ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className='text-muted'>No doctors available yet.</p>
        ) : (
          <div className='row'>
            {doctors.map(doc => (
              <div key={doc.id} className='col-md-4 mb-3'>
                <div className='card shadow p-3' style={{ borderRadius: '12px' }}>
                  <h5 className='fw-bold text-primary'>{doc.name}</h5>
                  <p className='text-muted mb-1'>{doc.specialization}</p>
                  <p className='text-muted mb-1 small'>{doc.qualification}</p>
                  <p className='text-muted mb-2 small'>{doc.experienceYears} years experience</p>
                  <button
                    className='btn btn-primary btn-sm'
                    disabled={bookingId === doc.id}
                    onClick={() => handleBook(doc.id)}
                  >
                    {bookingId === doc.id ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsList;