import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';


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

const AppLayout = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-setup" element={<PasswordSetupPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="d-flex bg-dark text-white" style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <main className="flex-grow-1 p-3">
          <Routes>
            
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['ADMIN']}><EmployeeManagement /></ProtectedRoute>} />
            <Route path="/admin/routes" element={<ProtectedRoute allowedRoles={['ADMIN']}><RouteManagement /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={['ADMIN']}><ApprovalManagement /></ProtectedRoute>} />
            <Route path="/admin/trips" element={<ProtectedRoute allowedRoles={['ADMIN']}><TripListView /></ProtectedRoute>} />

           
            <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/book-cab" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><CabBooking /></ProtectedRoute>} />
            <Route path="/employee/history" element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><BookingHistory /></ProtectedRoute>} />

            
            <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverDashboard /></ProtectedRoute>} />

            
            <Route path="/transport/dashboard" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><TransportDashboard /></ProtectedRoute>} />
            <Route path="/transport/vehicles" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><VehicleManagement /></ProtectedRoute>} />
            <Route path="/transport/drivers" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><DriverManagement /></ProtectedRoute>} />
            <Route path="/transport/mapping" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><DriverVehicleMapping /></ProtectedRoute>} />
            <Route path="/transport/trips" element={<ProtectedRoute allowedRoles={['TRANSPORT_TEAM']}><TripAssignment /></ProtectedRoute>} />

            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
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
