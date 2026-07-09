import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DriverVehicleMapping = () => {
  const [mappings, setMappings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  
  const [driverId, setDriverId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDropdownData = async () => {
    try {
      const dRes = await api.get('/transport/drivers');
      setDrivers(dRes.data);

      const vRes = await api.get('/transport/vehicles');
      setVehicles(vRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMappings = async () => {
    try {
      const response = await api.get('/transport/mappings');
      setMappings(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchMappings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!driverId || !vehicleId) {
      setError('Please select both driver and vehicle');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transport/mappings', { driverId, vehicleId });
      setMessage('Mapping request submitted successfully! Pending admin approval.');
      setDriverId('');
      setVehicleId('');
      fetchMappings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create driver-vehicle mapping');
    } finally {
      setLoading(false);
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
      <h1 className="fw-bold mb-4">Driver-Vehicle Mapping</h1>

      {message && <div className="alert alert-success p-2">{message}</div>}
      {error && <div className="alert alert-danger p-2">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Map Driver & Vehicle</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Driver</label>
                  <select className="form-select bg-dark text-white border-secondary" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.driverName} ({d.username}) - {d.approvalStatus}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Vehicle</label>
                  <select className="form-select bg-dark text-white border-secondary" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} ({v.vehicleModel}) - {v.approvalStatus}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Submit Mapping Request
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Current Mappings Log</h5>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Driver Name</th>
                      <th>Vehicle Number</th>
                      <th>Model</th>
                      <th>Date Assigned</th>
                      <th>Approval Status</th>
                      <th>Mapping Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-3 text-muted">No driver-vehicle mappings established.</td>
                      </tr>
                    ) : (
                      mappings.map((m) => (
                        <tr key={m.id}>
                          <td><strong>{m.driver.driverName}</strong></td>
                          <td>{m.vehicle.vehicleNumber}</td>
                          <td>{m.vehicle.vehicleModel}</td>
                          <td>{new Date(m.assignedDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${getApprovalBadge(m.approvalStatus)}`}>
                              {m.approvalStatus}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${m.mappingStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                              {m.mappingStatus}
                            </span>
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

export default DriverVehicleMapping;
