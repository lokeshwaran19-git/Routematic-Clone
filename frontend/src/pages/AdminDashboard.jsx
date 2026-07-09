import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
    name: '',
    email: '',
    username: '',
    role: 'EMPLOYEE',
    employeeId: '',
    department: '',
    phoneNumber: '',
    address: '',
    licenseNumber: '',
    experience: '',
    driverImage: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

    if (formData.role === 'EMPLOYEE' || formData.role === 'TRANSPORT_TEAM') {
      if (!formData.employeeId || !formData.department) {
        setError('Employee ID and Department are required for employee and transport team roles');
        return;
      }
    }

    if (formData.role === 'DRIVER') {
      if (!formData.licenseNumber) {
        setError('License Number is required for driver role');
        return;
      }
    }

    setLoading(true);
    try {
      await api.post('/admin/create-user', formData);
      setMessage(`Successfully created ${formData.role.replace('_', ' ')} user account!`);
      setFormData({
        name: '',
        email: '',
        username: '',
        role: 'EMPLOYEE',
        employeeId: '',
        department: '',
        phoneNumber: '',
        address: '',
        licenseNumber: '',
        experience: '',
        driverImage: ''
      });
      fetchStats(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Admin Dashboard</h1>
        <button className="btn btn-outline-light btn-sm" onClick={fetchStats}>
          Refresh Stats
        </button>
      </div>

      
      <div className="row g-3 mb-4">
        {[
          { title: 'Total Employees', value: stats.totalEmployees, bg: 'bg-primary' },
          { title: 'Total Drivers', value: stats.totalDrivers, bg: 'bg-success' },
          { title: 'Total Vehicles', value: stats.totalVehicles, bg: 'bg-info text-dark' },
          { title: 'Approved Vehicles', value: stats.approvedVehicles, bg: 'bg-success' },
          { title: 'Unapproved Vehicles', value: stats.unapprovedVehicles, bg: 'bg-warning text-dark' },
          { title: 'Approved Drivers', value: stats.approvedDrivers, bg: 'bg-success' },
          { title: 'Pending Requests', value: stats.pendingRequests, bg: 'bg-danger' },
          { title: 'Active Trips', value: stats.activeTrips, bg: 'bg-primary' }
        ].map((card, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div className={`card ${card.bg} text-white shadow-sm h-100 border-0`}>
              <div className="card-body d-flex flex-column justify-content-center p-3">
                <span className="text-uppercase text-light font-monospace small">{card.title}</span>
                <span className="fs-2 fw-bold mt-1">{card.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    
      <div className="card bg-secondary text-white shadow-sm border-0">
        <div className="card-header bg-dark border-bottom border-secondary p-3">
          <h5 className="mb-0 fw-bold">Create User Account</h5>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger p-2">{error}</div>}
          {message && <div className="alert alert-success p-2">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Role</label>
                <select className="form-select bg-dark text-white border-secondary" name="role" value={formData.role} onChange={handleChange}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="DRIVER">Driver</option>
                  <option value="TRANSPORT_TEAM">Transport Team</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
              </div>

              <div className="col-md-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control bg-dark text-white border-secondary" name="email" value={formData.email} onChange={handleChange} placeholder="email@routematic.com" />
              </div>

              <div className="col-md-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="username" value={formData.username} onChange={handleChange} placeholder="Unique username" />
              </div>

              
              {(formData.role === 'EMPLOYEE' || formData.role === 'TRANSPORT_TEAM') && (
                <>
                  <div className="col-md-3">
                    <label className="form-label">Employee ID</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="EMP123" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="department" value={formData.department} onChange={handleChange} placeholder="Engineering, Operations..." />
                  </div>
                </>
              )}

              {formData.role === 'DRIVER' && (
                <>
                  <div className="col-md-3">
                    <label className="form-label">License Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="DL-12345" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Experience (Years)</label>
                    <input type="number" className="form-control bg-dark text-white border-secondary" name="experience" value={formData.experience} onChange={handleChange} placeholder="Years" />
                  </div>
                </>
              )}

              <div className="col-md-3">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
              </div>

              <div className="col-md-9">
                <label className="form-label">Address</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="address" value={formData.address} onChange={handleChange} placeholder="Home Address details" />
              </div>
            </div>

            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-primary px-4 py-2" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : null}
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
