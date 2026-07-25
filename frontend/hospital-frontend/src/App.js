import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HospitalList from './pages/HospitalList';
import QueueStatus from './pages/QueueStatus';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to='/login' />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/hospitals' element={<PrivateRoute><HospitalList /></PrivateRoute>} />
        <Route path='/queue' element={<PrivateRoute><QueueStatus /></PrivateRoute>} />
        <Route path='/admin' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;
