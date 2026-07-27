import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HospitalList from './pages/HospitalList';
import QueueStatus from './pages/QueueStatus';
import AdminDashboard from './pages/AdminDashboard';
import AIPrediction from './pages/AIPrediction';
import DoctorsList from './pages/DoctorsList';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import MyAdmissions from './pages/MyAdmissions';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to='/login' />;

  if (allowedRoles) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to='/login' />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<PrivateRoute allowedRoles={['PATIENT']}><Dashboard /></PrivateRoute>} />
        <Route path='/hospitals' element={<PrivateRoute><HospitalList /></PrivateRoute>} />
        <Route path='/queue' element={<PrivateRoute><QueueStatus /></PrivateRoute>} />
        <Route path='/admin' element={<PrivateRoute allowedRoles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />
        <Route path='/doctor-dashboard' element={<PrivateRoute allowedRoles={['DOCTOR']}><DoctorDashboard /></PrivateRoute>} />
        <Route path='/ai-prediction' element={<PrivateRoute><AIPrediction /></PrivateRoute>} />
        <Route path='/doctors' element={<PrivateRoute><DoctorsList /></PrivateRoute>} />
        <Route path='/my-appointments' element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
        <Route path='/my-admissions' element={<PrivateRoute><MyAdmissions /></PrivateRoute>} />
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;