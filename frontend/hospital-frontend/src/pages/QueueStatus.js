import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { queueService } from '../services/api';

function QueueStatus() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    queueService.getPatientQueue(user.id)
      .then(res => { setQueues(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCancel = (queueId) => {
    queueService.cancel(queueId)
      .then(() => {
        setQueues(queues.filter(q => q.id !== queueId));
        toast.success('Queue entry cancelled.');
      })
      .catch(() => toast.error('Failed to cancel.'));
  };

  if (loading) return <div className='text-center mt-5'><div className='spinner-border text-primary'></div></div>;

  return (
    <div style={{minHeight: '100vh', background: '#f0f2f5'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>My Queue Status</span>
          <button className='btn btn-outline-light btn-sm' onClick={() => navigate('/dashboard')}>Back</button>
        </div>
      </nav>
      <div className='container mt-4'>
        {queues.length === 0 ? (
          <div className='text-center mt-5'>
            <div style={{fontSize: '60px'}}>&#128203;</div>
            <h5>You are not in any queue</h5>
            <button className='btn btn-primary mt-3' onClick={() => navigate('/hospitals')}>Find Hospital</button>
          </div>
        ) : (
          queues.map(queue => (
            <div key={queue.id} className='card shadow mb-3 p-4' style={{borderRadius: '15px'}}>
              <div className='row'>
                <div className='col-md-8'>
                  <h5 className='fw-bold text-primary'>{queue.hospital.name}</h5>
                  <p className='mb-1'>Bed Type: <strong>{queue.bedType}</strong></p>
                  <p className='mb-1'>Position: <strong className='text-danger'>#{queue.queuePosition}</strong></p>
                  <p className='mb-1'>Estimated Wait: <strong>{queue.estimatedWaitTime} minutes</strong></p>
                  <p className='mb-1'>Priority: <span className='badge bg-warning text-dark'>{queue.priority}</span></p>
                  <p className='mb-0'>Status: <span className='badge bg-success'>{queue.status}</span></p>
                </div>
                <div className='col-md-4 d-flex align-items-center justify-content-end'>
                  <button className='btn btn-danger' onClick={() => handleCancel(queue.id)}>Cancel Queue</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QueueStatus;