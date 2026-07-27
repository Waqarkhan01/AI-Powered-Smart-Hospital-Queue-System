import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/api';

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const patientId = localStorage.getItem('patientId');
    if (!patientId) {
      setError('Patient ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    notificationService.getPatientNotifications(patientId)
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );
        setNotifications(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load notifications.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((n) => (
            <li
              key={n.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <p style={{ margin: 0 }}>{n.message}</p>
              <small style={{ color: '#777' }}>
                {new Date(n.createdOn).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsList;