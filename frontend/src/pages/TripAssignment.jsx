import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TripAssignment = () => {
  const [routes, setRoutes] = useState([]);
  const [approvedMappings, setApprovedMappings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);

  const [tripName, setTripName] = useState('');
  const [routeId, setRouteId] = useState('');
  const [mappingId, setMappingId] = useState(''); 
  const [pickupTime, setPickupTime] = useState('');
  const [dropTime, setDropTime] = useState('');
  const [tripDate, setTripDate] = useState('');

  const [selectedTripId, setSelectedTripId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const rRes = await api.get('/admin/routes');
      setRoutes(rRes.data);

      const mRes = await api.get('/transport/mappings');
      const filtered = mRes.data.filter(m => m.approvalStatus === 'APPROVED' && m.mappingStatus === 'ACTIVE');
      setApprovedMappings(filtered);

      const tRes = await api.get('/transport/trips');
      setTrips(tRes.data);

      const bRes = await api.get('/transport/bookings');
      const unassigned = bRes.data.filter(b => b.bookingStatus === 'PENDING' && b.trip === null);
      setPendingBookings(unassigned);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!tripName || !routeId || !mappingId || !pickupTime || !dropTime || !tripDate) {
      setError('Please fill in all fields for trip creation');
      return;
    }

    const mapping = approvedMappings.find(m => m.id === parseInt(mappingId));
    if (!mapping) {
      setError('Invalid Driver-Vehicle mapping selected');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        tripName,
        routeId: parseInt(routeId),
        driverId: mapping.driver.id,
        vehicleId: mapping.vehicle.id,
        pickupTime,
        dropTime,
        tripDate
      };
      await api.post('/transport/trips', payload);
      setMessage('Trip scheduled successfully!');
      
      setTripName('');
      setRouteId('');
      setMappingId('');
      setPickupTime('');
      setDropTime('');
      setTripDate('');
      
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignBooking = async (bookingId) => {
    if (!selectedTripId) {
      alert('Please select a trip first from the dropdown');
      return;
    }

    try {
      await api.post(`/transport/trips/${selectedTripId}/assign-employee/${bookingId}`);
      alert('Employee successfully assigned to trip!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to assign employee to trip.');
    }
  };

  const handleUpdateTripStatus = async (tripId, status) => {
    try {
      await api.put(`/driver/trips/${tripId}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update trip status');
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

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Trip Scheduling & Booking Management</h1>

      {message && <div className="alert alert-success p-2">{message}</div>}
      {error && <div className="alert alert-danger p-2">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card bg-secondary text-white border-0 shadow-sm mb-4">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Schedule New Trip</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleCreateTrip}>
                <div className="mb-3">
                  <label className="form-label">Trip Name</label>
                  <input type="text" className="form-control bg-dark text-white border-secondary" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="e.g. Morning Shift Pickup" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Route</label>
                  <select className="form-select bg-dark text-white border-secondary" value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                    <option value="">Select Route</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>{r.routeName} ({r.startDestination} {"->"} {r.endDestination})</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Driver-Vehicle Pair (Approved Mappings Only)</label>
                  <select className="form-select bg-dark text-white border-secondary" value={mappingId} onChange={(e) => setMappingId(e.target.value)}>
                    <option value="">Select Assigned Pair</option>
                    {approvedMappings.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.driver.driverName} - {m.vehicle.vehicleNumber} ({m.vehicle.vehicleModel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label">Pickup Time</label>
                    <input type="time" className="form-control bg-dark text-white border-secondary" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Drop Time</label>
                    <input type="time" className="form-control bg-dark text-white border-secondary" value={dropTime} onChange={(e) => setDropTime(e.target.value)} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Trip Date</label>
                  <input type="date" className="form-control bg-dark text-white border-secondary" value={tripDate} onChange={(e) => setTripDate(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Schedule Trip
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card bg-secondary text-white border-0 shadow-sm mb-4">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Assign Employee Booking Requests</h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <label className="form-label fw-bold text-info">Step 1: Select Active Target Trip</label>
                <select className="form-select bg-dark text-white border-secondary" value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)}>
                  <option value="">Choose trip to assign employees to...</option>
                  {trips.filter(t => t.tripStatus === 'Scheduled' || t.tripStatus === 'Started').map((t) => (
                    <option key={t.id} value={t.id}>
                      #{t.id} {t.tripName} | Route: {t.route?.routeName} | Cab: {t.vehicle?.vehicleNumber} ({t.tripStatus})
                    </option>
                  ))}
                </select>
              </div>

              <label className="form-label fw-bold text-info">Step 2: Assign Pending Bookings</label>
              <div className="table-responsive" style={{ maxHeight: '280px' }}>
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Route Details (Pickup/Drop)</th>
                      <th>Booking Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted">No pending bookings to assign.</td>
                      </tr>
                    ) : (
                      pendingBookings.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <strong>{b.employee.user.name}</strong>
                            <div className="small text-muted">{b.employee.employeeId} - {b.employee.department}</div>
                          </td>
                          <td>
                            <div>P: {b.pickupLocation}</div>
                            <div>D: {b.dropLocation}</div>
                          </td>
                          <td>{b.bookingDate}</td>
                          <td>
                            <button className="btn btn-sm btn-success" onClick={() => handleAssignBooking(b.id)}>
                              Assign
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
        </div>
      </div>

      <div className="card bg-secondary text-white border-0 shadow-sm">
        <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Active Trip Status Monitor</h5>
          <button className="btn btn-sm btn-outline-light" onClick={fetchData}>Refresh Monitor</button>
        </div>
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Trip Name</th>
                  <th>Route</th>
                  <th>Vehicle Details</th>
                  <th>Driver Details</th>
                  <th>Timing</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-3 text-muted">No trips assigned yet.</td>
                  </tr>
                ) : (
                  trips.map((t) => (
                    <tr key={t.id}>
                      <td>#{t.id}</td>
                      <td><strong>{t.tripName}</strong></td>
                      <td>{t.route ? t.route.routeName : 'N/A'}</td>
                      <td>{t.vehicle ? `${t.vehicle.vehicleNumber} (${t.vehicle.vehicleModel})` : 'N/A'}</td>
                      <td>{t.driver ? t.driver.driverName : 'N/A'}</td>
                      <td>P: {t.pickupTime} | D: {t.dropTime}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(t.tripStatus)}`}>
                          {t.tripStatus}
                        </span>
                      </td>
                      <td>
                        {t.tripStatus === 'Scheduled' && (
                          <button className="btn btn-sm btn-warning text-dark me-2" onClick={() => handleUpdateTripStatus(t.id, 'Started')}>Start</button>
                        )}
                        {t.tripStatus === 'Started' && (
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateTripStatus(t.id, 'Completed')}>Complete</button>
                        )}
                        {(t.tripStatus === 'Scheduled' || t.tripStatus === 'Started') && (
                          <button className="btn btn-sm btn-danger" onClick={() => handleUpdateTripStatus(t.id, 'Cancelled')}>Cancel</button>
                        )}
                        {t.tripStatus === 'Completed' && <span className="text-success small">✔ Finished</span>}
                        {t.tripStatus === 'Cancelled' && <span className="text-danger small">✘ Cancelled</span>}
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
  );
};

export default TripAssignment;
