import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg glass-panel border-0 border-bottom sticky-top px-3 py-3 mx-2 mt-2 mb-4 rounded-3 z-3">
      <div className="container-fluid px-0">
        <div className="d-flex align-items-center gap-3">
          {/* Hamburger Menu for Mobile */}
          <button 
            className="btn btn-link text-white d-lg-none p-0 border-0"
            onClick={toggleSidebar}
          >
            <Menu size={28} />
          </button>

          <span className="navbar-brand mb-0 h1 fw-normal text-secondary d-none d-sm-block">
            Welcome, <strong className="text-white">{user.name}</strong>
          </span>
        </div>
        
        <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto">
          <span 
            className="badge bg-primary px-2 py-1 px-sm-3 py-sm-2 rounded-pill font-monospace text-uppercase shadow-sm d-none d-sm-inline-block" 
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            {user.role.replace('_', ' ')}
          </span>
          <span className={`badge ${user.status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'} px-2 py-1 rounded-pill shadow-sm`}>
            {user.status}
          </span>
          
          <div className="vr bg-secondary mx-1 d-none d-sm-block"></div>

          <button 
            className="btn btn-danger btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm border-0 transition-all hover-scale"
            onClick={handleLogout}
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}
          >
            <LogOut size={16} />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
      <style>{`
        .hover-scale {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-scale:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
