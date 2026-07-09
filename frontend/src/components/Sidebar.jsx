import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Route as RouteIcon, CheckSquare, 
  MapPin, Car, FileText, Calendar, X 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const NavItem = ({ to, icon: Icon, children }) => (
    <li className="nav-item mb-2">
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `nav-link d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${
            isActive ? 'bg-primary text-white shadow-lg' : 'text-secondary hover-bg-secondary hover-text-white'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="fw-medium">{children}</span>
          </>
        )}
      </NavLink>
    </li>
  );

  const renderNavLinks = () => {
    switch (user.role) {
      case 'ADMIN':
        return (
          <>
            <NavItem to="/admin/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem to="/admin/employees" icon={Users}>Employees</NavItem>
            <NavItem to="/admin/routes" icon={RouteIcon}>Manage Routes</NavItem>
            <NavItem to="/admin/approvals" icon={CheckSquare}>Pending Approvals</NavItem>
            <NavItem to="/admin/trips" icon={MapPin}>All Trips</NavItem>
          </>
        );
      case 'EMPLOYEE':
        return (
          <>
            <NavItem to="/employee/dashboard" icon={Car}>My Cab Details</NavItem>
            <NavItem to="/employee/book-cab" icon={Calendar}>Book Cab</NavItem>
            <NavItem to="/employee/history" icon={FileText}>Booking History</NavItem>
          </>
        );
      case 'DRIVER':
        return (
          <>
            <NavItem to="/driver/dashboard" icon={MapPin}>Assigned Trips</NavItem>
          </>
        );
      case 'TRANSPORT_TEAM':
        return (
          <>
            <NavItem to="/transport/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem to="/transport/vehicles" icon={Car}>Vehicle Induction</NavItem>
            <NavItem to="/transport/drivers" icon={Users}>Driver Induction</NavItem>
            <NavItem to="/transport/mapping" icon={MapPin}>Driver-Vehicle Mapping</NavItem>
            <NavItem to="/transport/trips" icon={RouteIcon}>Trip Management</NavItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`sidebar-container bg-dark border-end border-secondary ${isOpen ? 'open' : ''}`}
      style={{
        width: '280px',
        minHeight: '100vh',
        zIndex: 1050,
      }}
    >
      <div className="d-flex flex-column h-100 p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <NavLink to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-primary bg-gradient p-2 rounded-circle shadow-sm">
              <Car size={24} color="white" />
            </div>
            <span className="fs-4 fw-bold text-gradient mb-0" style={{ letterSpacing: '-0.5px' }}>Routematic</span>
          </NavLink>
          {/* Close button for mobile */}
          <button 
            className="btn btn-link text-secondary d-lg-none p-0 border-0"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="border-bottom border-secondary mb-4 opacity-25" />
        
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {renderNavLinks()}
        </ul>
      </div>

      <style>{`
        /* Desktop */
        .sidebar-container {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Mobile off-canvas */
        @media (max-width: 991.98px) {
          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            background: var(--bg-dark) !important;
            box-shadow: 10px 0 30px rgba(0,0,0,0.5);
          }
          
          .sidebar-container.open {
            transform: translateX(0);
          }
        }
        
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        
        .hover-text-white:hover {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
