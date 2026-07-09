import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const renderNavLinks = () => {
    switch (user.role) {
      case 'ADMIN':
        return (
          <>
            <li className="nav-item mb-2">
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.2 1.3c-.3-.3-.8-.3-1.1 0L3 5.3v7.4c0 .8.6 1.3 1.3 1.3h7.4c.7 0 1.3-.5 1.3-1.3V5.3L8.2 1.3zM7.5 2.2V6h1V2.2L12.5 6v6.7h-9V6L7.5 2.2z"/></svg>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/admin/employees" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.72C2.312 10.629 3.282 10 5 10zM3.1 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm.7-3a3 3 0 1 1-2.9 3 3 0 0 1 2.9-3z"/></svg>
                Employees
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/admin/routes" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.5 4v3.5h3a.5.5 0 0 1 0 1h-3V12a.5.5 0 0 1-1 0V8.5h-3a.5.5 0 0 1 0-1h3V4a.5.5 0 0 1 1 0z"/></svg>
                Manage Routes
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/admin/approvals" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/></svg>
                Pending Approvals
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/admin/trips" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>
                All Trips
              </NavLink>
            </li>
          </>
        );
      case 'EMPLOYEE':
        return (
          <>
            <li className="nav-item mb-2">
              <NavLink to="/employee/dashboard" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.2 1.3c-.3-.3-.8-.3-1.1 0L3 5.3v7.4c0 .8.6 1.3 1.3 1.3h7.4c.7 0 1.3-.5 1.3-1.3V5.3L8.2 1.3z"/></svg>
                My Cab Details
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/employee/book-cab" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.5 4v3.5h3a.5.5 0 0 1 0 1h-3V12a.5.5 0 0 1-1 0V8.5h-3a.5.5 0 0 1 0-1h3V4a.5.5 0 0 1 1 0z"/></svg>
                Book Cab
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/employee/history" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>
                Booking History
              </NavLink>
            </li>
          </>
        );
      case 'DRIVER':
        return (
          <>
            <li className="nav-item mb-2">
              <NavLink to="/driver/dashboard" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.2 1.3c-.3-.3-.8-.3-1.1 0L3 5.3v7.4c0 .8.6 1.3 1.3 1.3h7.4c.7 0 1.3-.5 1.3-1.3V5.3L8.2 1.3z"/></svg>
                Assigned Trips
              </NavLink>
            </li>
          </>
        );
      case 'TRANSPORT_TEAM':
        return (
          <>
            <li className="nav-item mb-2">
              <NavLink to="/transport/dashboard" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.2 1.3c-.3-.3-.8-.3-1.1 0L3 5.3v7.4c0 .8.6 1.3 1.3 1.3h7.4c.7 0 1.3-.5 1.3-1.3V5.3L8.2 1.3z"/></svg>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/transport/vehicles" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4zm1 2h6v2H5V3zm6 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM5 8h6v2H5V8z"/></svg>
                Vehicle Induction
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/transport/drivers" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
                Driver Induction
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/transport/mapping" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zm-7-13a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"/><path d="M8 5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-4 5a.5.5 0 0 1 .5-.5h3C8 10 8 11 8 11H4.5a.5.5 0 0 1-.5-.5z"/></svg>
                Driver-Vehicle Mapping
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/transport/trips" className={({ isActive }) => `nav-link text-white d-flex align-items-center gap-2 p-3 rounded ${isActive ? 'bg-primary shadow' : 'hover-bg-secondary'}`}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>
                Trip Management
              </NavLink>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark border-end border-secondary" style={{ width: '280px', minHeight: '100vh' }}>
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <svg className="bi me-2" width="40" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6z"/>
        </svg>
        <span className="fs-4 fw-bold text-gradient">Routematic</span>
      </div>
      <hr className="border-secondary" />
      <ul className="nav nav-pills flex-column mb-auto">
        {renderNavLinks()}
      </ul>
      <style>{`
        .hover-bg-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .text-gradient {
          background: linear-gradient(45deg, #007bff, #00d2ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
