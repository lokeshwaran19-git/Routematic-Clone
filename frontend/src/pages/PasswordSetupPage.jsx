import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PasswordSetupPage = () => {
  const { setupPassword } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    } else {
      navigate('/login'); 
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await setupPassword(username, password);
      setSuccess('Password updated successfully! Redirecting...');
      setTimeout(() => {
        switch (updatedUser.role) {
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
            navigate('/login');
        }
      }, 2000);
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
          <h2 className="fw-bold">Password Setup</h2>
          <p className="text-muted">Create a password for <strong>{username}</strong> to activate your account</p>
        </div>

        {error && <div className="alert alert-danger p-2" role="alert">{error}</div>}
        {success && <div className="alert alert-success p-2" role="alert">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || !!success}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!success}
            />
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 d-flex justify-content-center align-items-center gap-2" disabled={loading || !!success}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : null}
            Activate Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordSetupPage;
