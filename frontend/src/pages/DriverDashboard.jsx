import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [driverProfile, setDriverProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  const fetchProfileAndTrips = async () => {
    try {
      const pRes = await api.get(`/driver/profile/${user.id}`);
      setDriverProfile(pRes.data);

      const tRes = await api.get(`/driver/trips/${pRes.data.id}`);
      setTrips(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileAndTrips();
    }
  }, [user]);

  const handleTripSelect = async (trip) => {
    setSelectedTrip(trip);
    setPassengers([]);
    try {
      const response = await api.get(`/driver/trips/${trip.id}/employees`);
      setPassengers(response.data);
    } catch (err) {
      console.error("Error fetching passengers:", err);
    }
  };

  const handleStatusUpdate = async (tripId, status) => {
    try {
      const response = await api.put(`/driver/trips/${tripId}/status`, { status });
      setSelectedTrip(response.data);
      fetchProfileAndTrips();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdErr('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdErr('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdErr('New passwords do not match');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        userId: user.id,
        oldPassword,
        newPassword
      });
      setPwdMsg('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdErr(err.response?.data?.message || 'Password update failed');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-info text-dark';
      case 'Started': return 'bg-warning text-dark';
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 bg-dark text-white min-vh-100">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Driver Terminal</h1>
        {driverProfile && (
          <span className="badge bg-success px-3 py-2">
            Approved Profile: {driverProfile.approvalStatus}
          </span>
        )}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card bg-secondary text-white border-0 shadow-sm mb-4">
            <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Assigned Trips</h5>
              <button className="btn btn-sm btn-outline-light" onClick={fetchProfileAndTrips}>Refresh</button>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Trip Name</th>
                      <th>Route</th>
                      <th>Pickup/Drop</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-3 text-muted">No trips assigned to you.</td>
                      </tr>
                    ) : (
                      trips.map((t) => (
                        <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => handleTripSelect(t)}>
                          <td>#{t.id}</td>
                          <td><strong>{t.tripName}</strong></td>
                          <td>{t.route ? t.route.routeName : 'N/A'}</td>
                          <td>{t.pickupTime} / {t.dropTime}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(t.tripStatus)}`}>
                              {t.tripStatus}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); handleTripSelect(t); }}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Update Account Password</h5>
            </div>
            <div className="card-body p-4">
              {pwdMsg && <div className="alert alert-success p-2">{pwdMsg}</div>}
              {pwdErr && <div className="alert alert-danger p-2">{pwdErr}</div>}
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label className="form-label small">Current Password</label>
                  <input type="password" className="form-control form-control-sm bg-dark text-white border-secondary" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small">New Password</label>
                  <input type="password" className="form-control form-control-sm bg-dark text-white border-secondary" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Confirm New Password</label>
                  <input type="password" className="form-control form-control-sm bg-dark text-white border-secondary" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-sm btn-outline-warning w-100 py-2">Update Password</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          {selectedTrip ? (
            <div className="card bg-secondary text-white border-0 shadow-sm">
              <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Trip Details: #{selectedTrip.id}</h5>
                <span className={`badge ${getStatusBadge(selectedTrip.tripStatus)}`}>
                  {selectedTrip.tripStatus}
                </span>
              </div>
              <div className="card-body p-4">
                <h4 className="fw-bold text-info mb-3">{selectedTrip.tripName}</h4>
                <div className="mb-2"><strong>Vehicle:</strong> {selectedTrip.vehicle?.vehicleNumber} ({selectedTrip.vehicle?.vehicleModel})</div>
                <div className="mb-2"><strong>Route:</strong> {selectedTrip.route?.routeName} ({selectedTrip.route?.startDestination} → {selectedTrip.route?.endDestination})</div>
                <div className="mb-3"><strong>Timing:</strong> Pickup {selectedTrip.pickupTime} | Drop {selectedTrip.dropTime}</div>
                
                <div className="d-flex gap-2 mb-4">
                  {selectedTrip.tripStatus === 'Scheduled' && (
                    <button className="btn btn-warning text-dark flex-grow-1" onClick={() => handleStatusUpdate(selectedTrip.id, 'Started')}>
                      Start Trip
                    </button>
                  )}
                  {selectedTrip.tripStatus === 'Started' && (
                    <button className="btn btn-success flex-grow-1" onClick={() => handleStatusUpdate(selectedTrip.id, 'Completed')}>
                      Complete Trip
                    </button>
                  )}
                  {(selectedTrip.tripStatus === 'Scheduled' || selectedTrip.tripStatus === 'Started') && (
                    <button className="btn btn-outline-danger" onClick={() => handleStatusUpdate(selectedTrip.id, 'Cancelled')}>
                      Cancel Trip
                    </button>
                  )}
                </div>

                <h6 className="fw-bold mb-3 border-bottom border-secondary pb-2">Assigned Passengers</h6>
                {passengers.length === 0 ? (
                  <p className="text-muted small">No passengers assigned to this trip yet.</p>
                ) : (
                  <ul className="list-group list-group-flush bg-dark text-white rounded p-2">
                    {passengers.map((b) => (
                      <li key={b.id} className="list-group-item bg-transparent text-white border-secondary d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{b.employee.user.name}</strong>
                          <div className="small text-muted">Phone: {b.employee.phoneNumber || 'N/A'}</div>
                        </div>
                        <div className="text-end small">
                          <div>P: {b.pickupLocation}</div>
                          <div>D: {b.dropLocation}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="card bg-secondary text-white border-0 shadow-sm p-4 text-center text-muted">
              <p className="mb-0">Select a trip from the table to view passenger lists and update status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
