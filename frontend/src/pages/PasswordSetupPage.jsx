import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { KeyRound, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

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
    <div className="d-flex justify-content-center align-items-center min-vh-100 position-relative" style={{ backgroundColor: 'var(--bg-dark)' }}>
      {/* Abstract Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <div className="position-absolute rounded-circle" style={{ width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-10%', right: '-10%', filter: 'blur(40px)' }}></div>
        <div className="position-absolute rounded-circle" style={{ width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)', bottom: '-5%', left: '-5%', filter: 'blur(40px)' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="glass-panel p-4 p-md-5 rounded-4" 
        style={{ width: '100%', maxWidth: '420px', zIndex: 1, margin: '1rem' }}
      >
        <div className="text-center mb-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="d-inline-flex justify-content-center align-items-center bg-success bg-gradient rounded-circle mb-3 shadow-lg"
            style={{ width: '64px', height: '64px' }}
          >
            <ShieldCheck size={32} color="white" />
          </motion.div>
          <h2 className="fw-bold mb-1">Account Setup</h2>
          <p className="text-secondary small">Create a password for <strong className="text-white">{username}</strong></p>
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

        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="alert alert-success p-3 d-flex align-items-center gap-2 rounded-3 border-0 bg-success bg-opacity-10 text-success" 
            role="alert"
          >
            <CheckCircle2 size={20} className="flex-shrink-0" />
            <span className="small fw-medium">{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-secondary small fw-medium mb-2">New Password</label>
            <div className="position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                className="form-control form-control-lg ps-5"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!success}
                style={{ fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small fw-medium mb-2">Confirm Password</label>
            <div className="position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                className="form-control form-control-lg ps-5"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || !!success}
                style={{ fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn btn-success btn-lg w-100 py-3 d-flex justify-content-center align-items-center gap-2 mt-2" 
            disabled={loading || !!success}
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
          >
            {loading ? (
              <Loader2 size={20} className="spinner-border-sm animate-spin" />
            ) : (
              <span className="fw-semibold">Activate Account</span>
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

export default PasswordSetupPage;
