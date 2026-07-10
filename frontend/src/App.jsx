import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';

import LoginPage from './pages/LoginPage';
import PasswordSetupPage from './pages/PasswordSetupPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import RouteManagement from './pages/RouteManagement';
import ApprovalManagement from './pages/ApprovalManagement';
import TripListView from './pages/TripListView';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CabBooking from './pages/CabBooking';
import BookingHistory from './pages/BookingHistory';
import DriverDashboard from './pages/DriverDashboard';
import TransportDashboard from './pages/TransportDashboard';
import VehicleManagement from './pages/VehicleManagement';
import DriverManagement from './pages/DriverManagement';
import DriverVehicleMapping from './pages/DriverVehicleMapping';
import TripAssignment from './pages/TripAssignment';

const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
    case 'EMPLOYEE': return <Navigate to="/employee/dashboard" replace />;
    case 'DRIVER': return <Navigate to="/driver/dashboard" replace />;
    case 'TRANSPORT_TEAM': return <Navigate to="/transport/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/password-setup" element={<PageTransition><PasswordSetupPage /></PageTransition>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirect Root and Login when authenticated */}
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/login" element={<DashboardRedirect />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><EmployeeManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/routes" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><RouteManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><ApprovalManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/trips" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><TripListView /></PageTransition></ProtectedRoute>} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><PageTransition><EmployeeDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/employee/book-cab" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><PageTransition><CabBooking /></PageTransition></ProtectedRoute>} />
        <Route path="/employee/history" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><PageTransition><BookingHistory /></PageTransition></ProtectedRoute>} />

        {/* Driver Route */}
        <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={['DRIVER']}><PageTransition><DriverDashboard /></PageTransition></ProtectedRoute>} />

        {/* Transport Team Routes */}
        <Route path="/transport/dashboard" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><PageTransition><TransportDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/transport/vehicles" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><PageTransition><VehicleManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/transport/drivers" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><PageTransition><DriverManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/transport/mapping" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><PageTransition><DriverVehicleMapping /></PageTransition></ProtectedRoute>} />
        <Route path="/transport/trips" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><PageTransition><TripAssignment /></PageTransition></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar on location change for mobile
  const location = useLocation();
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return <AnimatedRoutes />;
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden', backgroundColor: 'var(--bg-dark)' }}>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay d-lg-none ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-grow-1 p-3 p-md-4" style={{ overflowY: 'auto' }}>
          <AnimatedRoutes />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
