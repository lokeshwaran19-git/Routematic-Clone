import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container mt-5 text-center bg-dark text-white p-5 rounded shadow">
        <h2 className="text-danger mb-4">Unauthorized Access</h2>
        <p className="lead">You do not have the required permissions to view this page.</p>
        <button className="btn btn-outline-primary mt-3" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
