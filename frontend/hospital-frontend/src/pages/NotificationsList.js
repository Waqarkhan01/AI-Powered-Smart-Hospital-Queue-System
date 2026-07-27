import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/api';

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    notificationService.getPatientNotifications(user.id)
      .then(res => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );
        setNotifications(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className='text-center mt-5'><div className='spinner-border text-primary'></div></div>;

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>My Notifications</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>
      <div className='container mt-4'>
        {notifications.length === 0 ? (
          <div className='text-center mt-5'>
            <h1>&#128276;</h1>
            <h5>No notifications yet</h5>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className='card shadow mb-3 p-3' style={{borderRadius: '15px'}}>
              <p className='mb-1'>{n.message}</p>
              <small className='text-muted'>{new Date(n.createdOn).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsList;