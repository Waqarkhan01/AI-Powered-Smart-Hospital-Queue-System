import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-fluid min-vh-100 d-flex align-items-center justify-content-center' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className='card shadow-lg p-4' style={{width: '400px', borderRadius: '15px'}}>
        <div className='text-center mb-4'>
          <h2 className='text-primary fw-bold'>?? Hospital Queue</h2>
          <p className='text-muted'>Sign in to your account</p>
        </div>
        {error && <div className='alert alert-danger'>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className='mb-3'>
            <label className='form-label fw-bold'>Email</label>
            <input type='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Enter your email' />
          </div>
          <div className='mb-3'>
            <label className='form-label fw-bold'>Password</label>
            <input type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Enter your password' />
          </div>
          <button type='submit' className='btn btn-primary w-100 fw-bold' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className='text-center mt-3'>
          <p>Don't have an account? <Link to='/register'>Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
