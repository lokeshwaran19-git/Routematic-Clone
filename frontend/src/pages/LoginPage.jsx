import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to respective dashboard
  useEffect(() => {
    if (user) {
      redirectUser(user);
    }
  }, [user]);

  const redirectUser = (u) => {
    switch (u.role) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'EMPLOYEE':
        navigate('/employee/dashboard');
        break;
      case 'DRIVER':
        navigate('/driver/dashboard');
        break;
      case 'TRANSPORT_TEAM':
        navigate('/transport/dashboard');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    try {
      const data = await login(username, password);
      
      if (data.status === 'PENDING') {
        navigate('/password-setup', { state: { username: data.username } });
      } else {
        redirectUser(data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="card bg-secondary text-white shadow-lg p-4 rounded" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <svg width="50" height="50" fill="currentColor" className="text-primary mb-2" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6z"/>
          </svg>
          <h2 className="fw-bold">Routematic</h2>
          <p className="text-muted">Employee Transportation System</p>
        </div>

        {error && <div className="alert alert-danger p-2" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Leave empty for first time"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <div className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
              Note: Keep empty if logging in for the first time.
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 d-flex justify-content-center align-items-center gap-2" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : null}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
