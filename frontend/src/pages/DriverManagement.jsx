import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    driverName: '',
    phoneNumber: '',
    licenseNumber: '',
    address: '',
    experience: '',
    driverImage: '',
    username: ''
  });

  const [editingDriver, setEditingDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/transport/drivers');
      setDrivers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingDriver({ ...editingDriver, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.driverName || !formData.phoneNumber || !formData.licenseNumber || !formData.username) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transport/drivers', formData);
      setMessage('Driver profile added! Pending admin approval.');
      setFormData({
        driverName: '',
        phoneNumber: '',
        licenseNumber: '',
        address: '',
        experience: '',
        driverImage: '',
        username: ''
      });
      fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add driver');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (d) => {
    setEditingDriver(d);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/transport/drivers/${editingDriver.id}`, editingDriver);
      setEditingDriver(null);
      setMessage('Driver details updated! Reset to unapproved.');
      fetchDrivers();
    } catch (err) {
      setError('Failed to update driver details.');
    }
  };

  const getApprovalBadge = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'UNAPPROVED': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Driver Induction</h1>

      {message && <div className="alert alert-success p-2">{message}</div>}
      {error && <div className="alert alert-danger p-2">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          {editingDriver ? (
            <div className="card bg-secondary text-white border-0 shadow-sm">
              <div className="card-header bg-dark border-bottom border-secondary">
                <h5 className="mb-0 fw-bold">Edit Driver Profile</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Driver Name</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="driverName" value={editingDriver.driverName} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="phoneNumber" value={editingDriver.phoneNumber} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">License Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="licenseNumber" value={editingDriver.licenseNumber} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Experience (Years)</label>
                    <input type="number" className="form-control bg-dark text-white border-secondary" name="experience" value={editingDriver.experience || ''} onChange={handleEditChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="username" value={editingDriver.username} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className="form-control bg-dark text-white border-secondary" name="address" rows="2" value={editingDriver.address || ''} onChange={handleEditChange}></textarea>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success flex-grow-1">Update Driver</button>
                    <button type="button" className="btn btn-outline-light" onClick={() => setEditingDriver(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card bg-secondary text-white border-0 shadow-sm">
              <div className="card-header bg-dark border-bottom border-secondary">
                <h5 className="mb-0 fw-bold">Register Driver</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Driver Name</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="driverName" value={formData.driverName} onChange={handleChange} placeholder="e.g. Ravi Kumar" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">License Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="e.g. DL-987654" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Experience (Years)</label>
                    <input type="number" className="form-control bg-dark text-white border-secondary" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Driver Username</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="username" value={formData.username} onChange={handleChange} placeholder="Username created by Admin" />
                    <div className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
                      Driver must possess a user account created by Admin.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className="form-control bg-dark text-white border-secondary" name="address" rows="2" value={formData.address} onChange={handleChange} placeholder="Home Address"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                    Onboard Driver
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Drivers List Column */}
        <div className="col-lg-8">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Registered Drivers</h5>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Driver Name</th>
                      <th>Phone</th>
                      <th>License Number</th>
                      <th>Experience</th>
                      <th>Username</th>
                      <th>Approval Status</th>
                      <th>Trip Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-3 text-muted">No drivers induced yet.</td>
                      </tr>
                    ) : (
                      drivers.map((d) => (
                        <tr key={d.id}>
                          <td><strong>{d.driverName}</strong></td>
                          <td>{d.phoneNumber}</td>
                          <td>{d.licenseNumber}</td>
                          <td>{d.experience} Years</td>
                          <td>{d.username}</td>
                          <td>
                            <span className={`badge ${getApprovalBadge(d.approvalStatus)}`}>
                              {d.approvalStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${d.driverStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                              {d.driverStatus}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-info" onClick={() => handleEditClick(d)}>Edit</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
