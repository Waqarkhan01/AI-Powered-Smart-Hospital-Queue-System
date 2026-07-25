import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', gender: 'Male', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-fluid min-vh-100 d-flex align-items-center justify-content-center' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className='card shadow-lg p-4' style={{width: '500px', borderRadius: '15px'}}>
        <div className='text-center mb-4'>
          <h2 className='text-primary fw-bold'>?? Register</h2>
          <p className='text-muted'>Create your account</p>
        </div>
        {error && <div className='alert alert-danger'>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className='mb-3'>
            <input type='text' className='form-control' name='name' placeholder='Full Name' onChange={handleChange} required />
          </div>
          <div className='mb-3'>
            <input type='email' className='form-control' name='email' placeholder='Email' onChange={handleChange} required />
          </div>
          <div className='mb-3'>
            <input type='password' className='form-control' name='password' placeholder='Password' onChange={handleChange} required />
          </div>
          <div className='mb-3'>
            <input type='text' className='form-control' name='phone' placeholder='Phone Number' onChange={handleChange} />
          </div>
          <div className='mb-3'>
            <select className='form-control' name='gender' onChange={handleChange}>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div className='mb-3'>
            <input type='text' className='form-control' name='address' placeholder='Address' onChange={handleChange} />
          </div>
          <button type='submit' className='btn btn-primary w-100 fw-bold' disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className='text-center mt-3'>
          <p>Already have an account? <Link to='/login'>Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
