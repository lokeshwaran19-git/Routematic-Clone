import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary px-4 py-3">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1 fw-normal text-muted">
          Welcome, <strong className="text-white">{user.name}</strong>
        </span>
        
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-primary px-3 py-2 rounded-pill font-monospace text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
            {user.role.replace('_', ' ')}
          </span>
          <span className={`badge ${user.status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'} px-2 py-1`}>
            {user.status}
          </span>
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-2" onClick={handleLogout}>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
