import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService, queueService } from '../services/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      const notifs = [];

      appointmentService.getPatientAppointments(user.id)
        .then(res => {
          res.data.forEach(appt => {
            notifs.push({
              id: 'appt-' + appt.id,
              type: appt.status === 'CONFIRMED' ? 'success' :
                    appt.status === 'CANCELLED' ? 'danger' : 'warning',
              icon: appt.status === 'CONFIRMED' ? 'Appointment Confirmed' :
                    appt.status === 'CANCELLED' ? 'Appointment Cancelled' : 'Appointment Pending',
              message: 'Dr. ' + appt.doctor?.name + ' - ' + appt.appointmentDate + ' at ' + appt.appointmentTime,
              status: appt.status,
              time: appt.appointmentDate
            });
          });

          return queueService.getPatientQueue(user.id);
        })
        .then(res => {
          res.data.forEach(q => {
            notifs.push({
              id: 'queue-' + q.id,
              type: q.status === 'ADMITTED' ? 'success' :
                    q.status === 'CANCELLED' ? 'danger' : 'info',
              icon: q.status === 'ADMITTED' ? 'Admitted to Hospital' :
                    q.status === 'CANCELLED' ? 'Queue Cancelled' : 'In Queue',
              message: q.hospital?.name + ' - ' + q.bedType + ' bed | Position: #' + q.queuePosition,
              status: q.status,
              time: q.joinedAt
            });
          });
          setNotifications(notifs);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  const getBorderColor = (type) => {
    switch(type) {
      case 'success': return '#28a745';
      case 'danger': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'success': return '#d4edda';
      case 'danger': return '#f8d7da';
      case 'warning': return '#fff3cd';
      case 'info': return '#d1ecf1';
      default: return '#f8f9fa';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>Notifications</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>
      <div className='container mt-4'>
        {loading ? (
          <div className='text-center mt-5'><div className='spinner-border text-primary'></div></div>
        ) : notifications.length === 0 ? (
          <div className='text-center mt-5'>
            <h5 className='text-muted'>No notifications yet</h5>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className='card shadow mb-3 p-3' style={{borderRadius: '12px', borderLeft: '5px solid ' + getBorderColor(notif.type), background: getBgColor(notif.type)}}>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <h6 className='fw-bold mb-1' style={{color: getBorderColor(notif.type)}}>{notif.icon}</h6>
                  <p className='mb-0 text-dark'>{notif.message}</p>
                </div>
                <span className={'badge bg-' + notif.type} style={{fontSize: '12px'}}>{notif.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
