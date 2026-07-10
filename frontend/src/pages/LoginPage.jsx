import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Car, User, KeyRound, AlertCircle, Loader2, Navigation } from 'lucide-react';

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="d-flex justify-content-center align-items-center min-vh-100 position-relative" style={{ backgroundColor: 'var(--bg-dark)' }}>
      {/* Abstract Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <div className="position-absolute rounded-circle" style={{ width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-10%', left: '-10%', filter: 'blur(40px)' }}></div>
        <div className="position-absolute rounded-circle" style={{ width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(0,0,0,0) 70%)', bottom: '-5%', right: '-5%', filter: 'blur(40px)' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="glass-panel p-4 p-md-5 rounded-4"
        style={{ width: '100%', maxWidth: '420px', zIndex: 1, margin: '1rem' }}
      >
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="d-inline-flex justify-content-center align-items-center bg-primary bg-gradient rounded-circle mb-3 shadow-lg"
            style={{ width: '64px', height: '64px' }}
          >
            <Navigation size={32} color="white" />
          </motion.div>
          <h2 className="fw-bold text-gradient mb-1">Routematic</h2>
          <p className="text-secondary small">Employee Transport Management System</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="alert alert-danger p-3 d-flex align-items-center gap-2 rounded-3 border-0 bg-danger bg-opacity-10 text-danger"
            role="alert"
          >
            <AlertCircle size={20} className="flex-shrink-0" />
            <span className="small fw-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-secondary small fw-medium mb-2">Username</label>
            <div className="position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">
                <User size={18} />
              </div>
              <input
                type="text"
                className="form-control form-control-lg ps-5"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                style={{ fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small fw-medium mb-2">Password</label>
            <div className="position-relative mb-2">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                className="form-control form-control-lg ps-5"
                placeholder="Leave empty for first time"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{ fontSize: '0.95rem' }}
              />
            </div>
            <div className="form-text text-secondary" style={{ fontSize: '0.75rem' }}>
              <span className="opacity-75">First time logging in? Leave the password blank to set it up.</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary btn-lg w-100 py-3 d-flex justify-content-center align-items-center gap-2 mt-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={20} className="spinner-border-sm animate-spin" />
            ) : (
              <span className="fw-semibold">Sign In</span>
            )}
          </motion.button>
        </form>
      </motion.div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
