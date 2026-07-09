import React, { useState, useEffect } from 'react';
import api from '../services/api';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Sedan',
    vehicleModel: '',
    seatingCapacity: '',
    fuelType: 'Diesel',
    rcBookNumber: '',
    insuranceNumber: '',
    pollutionCertificate: '',
    vehicleImage: ''
  });
  
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/transport/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingVehicle({ ...editingVehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.vehicleNumber || !formData.vehicleModel || !formData.seatingCapacity || !formData.rcBookNumber || !formData.insuranceNumber || !formData.pollutionCertificate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transport/vehicles', formData);
      setMessage('Vehicle added successfully! Pending admin approval.');
      setFormData({
        vehicleNumber: '',
        vehicleType: 'Sedan',
        vehicleModel: '',
        seatingCapacity: '',
        fuelType: 'Diesel',
        rcBookNumber: '',
        insuranceNumber: '',
        pollutionCertificate: '',
        vehicleImage: ''
      });
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (v) => {
    setEditingVehicle(v);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/transport/vehicles/${editingVehicle.id}`, editingVehicle);
      setEditingVehicle(null);
      setMessage('Vehicle details updated! Reset to unapproved.');
      fetchVehicles();
    } catch (err) {
      setError('Failed to update vehicle.');
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
      <h1 className="fw-bold mb-4">Vehicle Induction</h1>

      {message && <div className="alert alert-success p-2">{message}</div>}
      {error && <div className="alert alert-danger p-2">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          {editingVehicle ? (
            <div className="card bg-secondary text-white border-0 shadow-sm">
              <div className="card-header bg-dark border-bottom border-secondary">
                <h5 className="mb-0 fw-bold">Edit Vehicle Info</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Vehicle Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="vehicleNumber" value={editingVehicle.vehicleNumber} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Model</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="vehicleModel" value={editingVehicle.vehicleModel} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select className="form-select bg-dark text-white border-secondary" name="vehicleType" value={editingVehicle.vehicleType} onChange={handleEditChange}>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Mini-Bus">Mini-Bus</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Seating Capacity</label>
                    <input type="number" className="form-control bg-dark text-white border-secondary" name="seatingCapacity" value={editingVehicle.seatingCapacity} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fuel Type</label>
                    <select className="form-select bg-dark text-white border-secondary" name="fuelType" value={editingVehicle.fuelType} onChange={handleEditChange}>
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">RC Book Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="rcBookNumber" value={editingVehicle.rcBookNumber} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Insurance Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="insuranceNumber" value={editingVehicle.insuranceNumber} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Pollution Cert Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="pollutionCertificate" value={editingVehicle.pollutionCertificate} onChange={handleEditChange} required />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success flex-grow-1">Update Vehicle</button>
                    <button type="button" className="btn btn-outline-light" onClick={() => setEditingVehicle(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card bg-secondary text-white border-0 shadow-sm">
              <div className="card-header bg-dark border-bottom border-secondary">
                <h5 className="mb-0 fw-bold">Register Vehicle</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Vehicle Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="e.g. TN09AB1234" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Model</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="e.g. Toyota Innova" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select className="form-select bg-dark text-white border-secondary" name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Mini-Bus">Mini-Bus</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Seating Capacity</label>
                    <input type="number" className="form-control bg-dark text-white border-secondary" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} placeholder="Seating Capacity" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fuel Type</label>
                    <select className="form-select bg-dark text-white border-secondary" name="fuelType" value={formData.fuelType} onChange={handleChange}>
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">RC Book Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="rcBookNumber" value={formData.rcBookNumber} onChange={handleChange} placeholder="RC Registration Number" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Insurance Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} placeholder="Insurance Policy Number" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Pollution Cert Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="pollutionCertificate" value={formData.pollutionCertificate} onChange={handleChange} placeholder="PUC Cert Number" />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                    Onboard Vehicle
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-8">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Registered Vehicles</h5>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Vehicle Number</th>
                      <th>Model / Type</th>
                      <th>Capacity</th>
                      <th>RC Number</th>
                      <th>Approval Status</th>
                      <th>Trips Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-3 text-muted">No vehicles induced yet.</td>
                      </tr>
                    ) : (
                      vehicles.map((v) => (
                        <tr key={v.id}>
                          <td><strong>{v.vehicleNumber}</strong></td>
                          <td>{v.vehicleModel} ({v.vehicleType})</td>
                          <td>{v.seatingCapacity} seats</td>
                          <td>{v.rcBookNumber}</td>
                          <td>
                            <span className={`badge ${getApprovalBadge(v.approvalStatus)}`}>
                              {v.approvalStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${v.vehicleStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                              {v.vehicleStatus}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-info" onClick={() => handleEditClick(v)}>Edit</button>
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

export default VehicleManagement;
