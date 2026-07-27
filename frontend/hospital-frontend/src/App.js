import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to='/login' />;
};

function App() {
  return (
    <Router>
      <ToastContainer position='top-right' autoClose={3000} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/hospitals' element={<PrivateRoute><HospitalList /></PrivateRoute>} />
        <Route path='/queue' element={<PrivateRoute><QueueStatus /></PrivateRoute>} />
        <Route path='/admin' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path='/ai-prediction' element={<PrivateRoute><AIPrediction /></PrivateRoute>} />
        <Route path='/doctors' element={<PrivateRoute><DoctorsList /></PrivateRoute>} />
        <Route path='/my-appointments' element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
        <Route path='/doctor-dashboard' element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;
