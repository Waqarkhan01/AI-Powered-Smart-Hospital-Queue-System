import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hospitalService, queueService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [queue, setQueue] = useState([]);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    hospitalService.getAll().then(res => setHospitals(res.data)).catch(console.error);
    if (userData && userData.id) {
      queueService.getPatientQueue(userData.id).then(res => setQueue(res.data)).catch(console.error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const bg = darkMode ? '#1a1a2e' : '#f0f2f5';
  const cardBg = darkMode ? '#16213e' : 'white';
  const textColor = darkMode ? 'white' : 'black';
  const mutedColor = darkMode ? '#aaa' : '#6c757d';

  return (
    <div style={{minHeight: '100vh', background: bg, transition: 'all 0.3s'}}>
      <nav className='navbar navbar-dark' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className='container'>
          <span className='navbar-brand fw-bold'>Hospital Queue System</span>
          <div className='d-flex align-items-center gap-3'>
            <button className='btn btn-outline-light btn-sm' onClick={toggleDarkMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <span className='text-white'>Welcome, {user?.name}</span>
            <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className='container mt-4'>
        <div className='row mb-4'>
          <div className='col-md-4 mb-3'>
            <div className='card shadow text-center p-3' style={{borderRadius: '15px', borderLeft: '5px solid #667eea', background: cardBg, color: textColor}}>
              <h3 className='text-primary fw-bold'>{hospitals.length}</h3>
              <p style={{color: mutedColor}} className='mb-0'>Available Hospitals</p>
            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card shadow text-center p-3' style={{borderRadius: '15px', borderLeft: '5px solid #28a745', background: cardBg, color: textColor}}>
              <h3 className='text-success fw-bold'>{queue.length}</h3>
              <p style={{color: mutedColor}} className='mb-0'>My Queue Entries</p>
            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card shadow text-center p-3' style={{borderRadius: '15px', borderLeft: '5px solid #ffc107', background: cardBg, color: textColor}}>
              <h3 className='text-warning fw-bold'>Active</h3>
              <p style={{color: mutedColor}} className='mb-0'>System Status</p>
            </div>
          </div>
        </div>
        <h5 className='fw-bold mb-3' style={{color: mutedColor}}>Quick Actions</h5>
        <div className='row'>
          <div className='col-md-4 mb-3'>
            <Link to='/hospitals' className='text-decoration-none'>
              <div className='card shadow p-3 text-center' style={{borderRadius: '15px', cursor: 'pointer', background: cardBg, transition: 'transform 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize: '35px', marginBottom: '8px'}}>&#128968;</div>
                <h6 className='fw-bold text-primary'>Search Hospitals</h6>
                <p style={{color: mutedColor}} className='mb-0 small'>Find hospitals and beds</p>
              </div>
            </Link>
          </div>
          <div className='col-md-4 mb-3'>
            <Link to='/queue' className='text-decoration-none'>
              <div className='card shadow p-3 text-center' style={{borderRadius: '15px', cursor: 'pointer', background: cardBg, transition: 'transform 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize: '35px', marginBottom: '8px'}}>&#128203;</div>
                <h6 className='fw-bold text-success'>My Queue Status</h6>
                <p style={{color: mutedColor}} className='mb-0 small'>View queue position</p>
              </div>
            </Link>
          </div>
          <div className='col-md-4 mb-3'>
            <Link to='/ai-prediction' className='text-decoration-none'>
              <div className='card shadow p-3 text-center' style={{borderRadius: '15px', cursor: 'pointer', transition: 'transform 0.2s', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize: '35px', marginBottom: '8px'}}>&#129302;</div>
                <h6 className='fw-bold text-white'>AI Priority</h6>
                <p className='text-white mb-0 small' style={{opacity: 0.8}}>Get AI prediction</p>
              </div>
            </Link>
          </div>
          <div className='col-md-4 mb-3'>
            <Link to='/doctors' className='text-decoration-none'>
              <div className='card shadow p-3 text-center' style={{borderRadius: '15px', cursor: 'pointer', background: cardBg, transition: 'transform 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize: '35px', marginBottom: '8px'}}>&#128105;&#8205;&#9877;&#65039;</div>
                <h6 className='fw-bold text-info'>Find Doctors</h6>
                <p style={{color: mutedColor}} className='mb-0 small'>Book appointments</p>
              </div>
            </Link>
          </div>
          <div className='col-md-4 mb-3'>
            <Link to='/my-appointments' className='text-decoration-none'>
              <div className='card shadow p-3 text-center' style={{borderRadius: '15px', cursor: 'pointer', background: cardBg, transition: 'transform 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize: '35px', marginBottom: '8px'}}>&#128197;</div>
                <h6 className='fw-bold text-warning'>My Appointments</h6>
                <p style={{color: mutedColor}} className='mb-0 small'>View and manage</p>
              </div>
            </Link>
          </div>
          <div className='col-md-4 mb-3'>
            <Link to='/my-admissions' className='text-decoration-none'>
              <div className='card shadow p-3 text-center' style={{borderRadius: '15px', cursor: 'pointer', background: cardBg, transition: 'transform 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize: '35px', marginBottom: '8px'}}>&#127973;</div>
                <h6 className='fw-bold text-danger'>My Admissions</h6>
                <p style={{color: mutedColor}} className='mb-0 small'>View hospital admissions</p>
              </div>
            </Link>
          </div>
          <div className='col-md-4 mb-3'>
            <Link to='/notifications' className='text-decoration-none'>
              <div className='card shadow p-3 text-center' style={{borderRadius: '15px', cursor: 'pointer', background: cardBg, transition: 'transform 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize: '35px', marginBottom: '8px'}}>&#128276;</div>
                <h6 className='fw-bold' style={{color: '#667eea'}}>Notifications</h6>
                <p style={{color: mutedColor}} className='mb-0 small'>View all updates</p>
              </div>
            </Link>
          </div>
        </div>
        {hospitals.length > 0 && (
          <div className='mt-4'>
            <h5 className='fw-bold mb-3' style={{color: mutedColor}}>Hospitals Near You</h5>
            <div className='row'>
              {hospitals.slice(0,3).map(h => (
                <div key={h.id} className='col-md-4 mb-3'>
                  <div className='card shadow p-3' style={{borderRadius: '10px', borderTop: '3px solid #667eea', background: cardBg}}>
                    <h6 className='fw-bold text-primary'>{h.name}</h6>
                    <p style={{color: mutedColor}} className='mb-1 small'>{h.address}, {h.city}</p>
                    <p style={{color: mutedColor}} className='mb-0 small'>Rating: {h.rating} / 5.0</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
