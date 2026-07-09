import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ApprovalManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [activeTab, setActiveTab] = useState('vehicles');

  const fetchPendingData = async () => {
    try {
      const vRes = await api.get('/admin/pending-vehicles');
      setVehicles(vRes.data);

      const dRes = await api.get('/admin/pending-drivers');
      setDrivers(dRes.data);

      const mRes = await api.get('/admin/pending-mappings');
      setMappings(mRes.data);
    } catch (err) {
      console.error("Error fetching approvals:", err);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  const handleVehicleAction = async (id, action) => {
    try {
      await api.put(`/admin/vehicles/${id}/${action}`);
      fetchPendingData();
    } catch (err) {
      alert(`Failed to ${action} vehicle.`);
    }
  };

  const handleDriverAction = async (id, action) => {
    try {
      await api.put(`/admin/drivers/${id}/${action}`);
      fetchPendingData();
    } catch (err) {
      alert(`Failed to ${action} driver.`);
    }
  };

  const handleMappingAction = async (id, action) => {
    try {
      await api.put(`/admin/mappings/${id}/${action}`);
      fetchPendingData();
    } catch (err) {
      alert(`Failed to ${action} mapping.`);
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Pending Approvals</h1>

      <ul className="nav nav-tabs mb-4 border-secondary">
        <li className="nav-item">
          <button className={`nav-link text-white ${activeTab === 'vehicles' ? 'active bg-primary border-primary' : 'bg-transparent border-0'}`} onClick={() => setActiveTab('vehicles')}>
            Vehicles ({vehicles.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link text-white ${activeTab === 'drivers' ? 'active bg-primary border-primary' : 'bg-transparent border-0'}`} onClick={() => setActiveTab('drivers')}>
            Drivers ({drivers.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link text-white ${activeTab === 'mappings' ? 'active bg-primary border-primary' : 'bg-transparent border-0'}`} onClick={() => setActiveTab('mappings')}>
            Driver-Vehicle Mappings ({mappings.length})
          </button>
        </li>
      </ul>

      {activeTab === 'vehicles' && (
        <div className="card bg-secondary text-white border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Vehicle Number</th>
                    <th>Model / Type</th>
                    <th>Capacity</th>
                    <th>Fuel</th>
                    <th>RC Book</th>
                    <th>Insurance</th>
                    <th>Pollution Cert</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">No pending vehicles to approve.</td>
                    </tr>
                  ) : (
                    vehicles.map((v) => (
                      <tr key={v.id}>
                        <td><strong>{v.vehicleNumber}</strong></td>
                        <td>{v.vehicleModel} ({v.vehicleType})</td>
                        <td>{v.seatingCapacity} seats</td>
                        <td>{v.fuelType}</td>
                        <td>{v.rcBookNumber}</td>
                        <td>{v.insuranceNumber}</td>
                        <td>{v.pollutionCertificate}</td>
                        <td>
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleVehicleAction(v.id, 'approve')}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleVehicleAction(v.id, 'reject')}>Reject</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="card bg-secondary text-white border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Driver Name</th>
                    <th>License Number</th>
                    <th>Phone Number</th>
                    <th>Experience</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-3 text-muted">No pending drivers to approve.</td>
                    </tr>
                  ) : (
                    drivers.map((d) => (
                      <tr key={d.id}>
                        <td><strong>{d.driverName}</strong></td>
                        <td>{d.licenseNumber}</td>
                        <td>{d.phoneNumber}</td>
                        <td>{d.experience} Years</td>
                        <td>{d.address || 'N/A'}</td>
                        <td>
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleDriverAction(d.id, 'approve')}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDriverAction(d.id, 'reject')}>Reject</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mappings' && (
        <div className="card bg-secondary text-white border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Driver Name</th>
                    <th>Vehicle Number</th>
                    <th>Vehicle Model</th>
                    <th>Assigned Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-3 text-muted">No pending driver-vehicle mappings to approve.</td>
                    </tr>
                  ) : (
                    mappings.map((m) => (
                      <tr key={m.id}>
                        <td><strong>{m.driver.driverName}</strong></td>
                        <td>{m.vehicle.vehicleNumber}</td>
                        <td>{m.vehicle.vehicleModel}</td>
                        <td>{new Date(m.assignedDate).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleMappingAction(m.id, 'approve')}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleMappingAction(m.id, 'reject')}>Reject</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalManagement;
