import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Users, Car, CheckCircle, XCircle, Clock, Navigation, RefreshCw, UserPlus } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const StatCard = ({ title, value, icon: Icon, gradient, index }) => (
  <motion.div 
    variants={itemVariants}
    className="col-6 col-md-4 col-lg-3"
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
  >
    <div className="glass-panel rounded-4 p-3 h-100 position-relative overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="position-absolute top-0 end-0 p-3 opacity-10" style={{ transform: 'scale(2)' }}>
        <Icon size={40} />
      </div>
      <div className="d-flex flex-column gap-1">
        <span className="text-secondary small fw-medium">{title}</span>
        <span className="fw-bold" style={{ fontSize: '2rem', lineHeight: 1, background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</span>
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDrivers: 0,
    totalVehicles: 0,
    approvedVehicles: 0,
    unapprovedVehicles: 0,
    approvedDrivers: 0,
    pendingRequests: 0,
    activeTrips: 0
  });

  const [formData, setFormData] = useState({
    name: '', email: '', username: '', role: 'EMPLOYEE',
    employeeId: '', department: '', phoneNumber: '',
    address: '', licenseNumber: '', experience: '', driverImage: ''
  });

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.name || !formData.email || !formData.username) {
      setError('Name, Email and Username are required');
      return;
    }
    if ((formData.role === 'EMPLOYEE' || formData.role === 'TRANSPORT_TEAM') && (!formData.employeeId || !formData.department)) {
      setError('Employee ID and Department are required for employee and transport team roles');
      return;
    }
    if (formData.role === 'DRIVER' && !formData.licenseNumber) {
      setError('License Number is required for driver role');
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/create-user', formData);
      setMessage(`Successfully created ${formData.role.replace('_', ' ')} user account!`);
      setFormData({ name: '', email: '', username: '', role: 'EMPLOYEE', employeeId: '', department: '', phoneNumber: '', address: '', licenseNumber: '', experience: '', driverImage: '' });
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Employees', value: stats.totalEmployees, icon: Users, gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
    { title: 'Total Drivers', value: stats.totalDrivers, icon: Car, gradient: 'linear-gradient(135deg, #34d399, #10b981)' },
    { title: 'Total Vehicles', value: stats.totalVehicles, icon: Navigation, gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
    { title: 'Approved Vehicles', value: stats.approvedVehicles, icon: CheckCircle, gradient: 'linear-gradient(135deg, #34d399, #10b981)' },
    { title: 'Unapproved Vehicles', value: stats.unapprovedVehicles, icon: XCircle, gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    { title: 'Approved Drivers', value: stats.approvedDrivers, icon: CheckCircle, gradient: 'linear-gradient(135deg, #34d399, #10b981)' },
    { title: 'Pending Requests', value: stats.pendingRequests, icon: Clock, gradient: 'linear-gradient(135deg, #f87171, #ef4444)' },
    { title: 'Active Trips', value: stats.activeTrips, icon: Navigation, gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3"
      >
        <div>
          <h1 className="fw-bold mb-1">Admin Dashboard</h1>
          <p className="text-secondary small mb-0">Manage users, monitor metrics, and create accounts.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn btn-sm glass-panel text-white border-0 d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          onClick={fetchStats} disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className="row g-3 mb-5" variants={containerVariants} initial="hidden" animate="show">
        {statCards.map((card, idx) => (
          <StatCard key={idx} {...card} index={idx} />
        ))}
      </motion.div>

      {/* Create User Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="glass-panel rounded-4 overflow-hidden">
          <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
            <div className="d-flex align-items-center gap-2">
              <UserPlus size={22} className="text-primary" />
              <h5 className="mb-0 fw-bold">Create User Account</h5>
            </div>
          </div>
          <div className="p-4">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-danger border-0 rounded-3 bg-danger bg-opacity-10 text-danger p-3 mb-4">
                {error}
              </motion.div>
            )}
            {message && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-success border-0 rounded-3 bg-success bg-opacity-10 text-success p-3 mb-4">
                {message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label text-secondary small fw-medium">Role</label>
                  <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="DRIVER">Driver</option>
                    <option value="TRANSPORT_TEAM">Transport Team</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label text-secondary small fw-medium">Full Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-secondary small fw-medium">Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="email@routematic.com" />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-secondary small fw-medium">Username</label>
                  <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} placeholder="Unique username" />
                </div>

                {(formData.role === 'EMPLOYEE' || formData.role === 'TRANSPORT_TEAM') && (
                  <>
                    <div className="col-md-3">
                      <label className="form-label text-secondary small fw-medium">Employee ID</label>
                      <input type="text" className="form-control" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="EMP123" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-secondary small fw-medium">Department</label>
                      <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} placeholder="Engineering, Operations..." />
                    </div>
                  </>
                )}

                {formData.role === 'DRIVER' && (
                  <>
                    <div className="col-md-3">
                      <label className="form-label text-secondary small fw-medium">License Number</label>
                      <input type="text" className="form-control" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="DL-12345" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-secondary small fw-medium">Experience (Years)</label>
                      <input type="number" className="form-control" name="experience" value={formData.experience} onChange={handleChange} placeholder="Years" />
                    </div>
                  </>
                )}

                <div className="col-md-3">
                  <label className="form-label text-secondary small fw-medium">Phone Number</label>
                  <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
                </div>
                <div className="col-md-9">
                  <label className="form-label text-secondary small fw-medium">Address</label>
                  <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Home Address details" />
                </div>
              </div>

              <div className="mt-4 d-flex justify-content-end">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" 
                  disabled={loading}
                >
                  {loading ? <span className="spinner-border spinner-border-sm" role="status"></span> : <UserPlus size={16} />}
                  Create User
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
