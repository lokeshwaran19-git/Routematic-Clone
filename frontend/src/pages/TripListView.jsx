import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TripListView = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transport/trips');
      setTrips(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

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
      <h1 className="fw-bold mb-4">All Trips</h1>

      <div className="card bg-secondary text-white border-0 shadow-sm">
        <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">System Trips Log</h5>
          <button className="btn btn-sm btn-outline-light" onClick={fetchTrips}>Refresh</button>
        </div>
        <div className="card-body p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-light" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Trip Name</th>
                    <th>Route</th>
                    <th>Vehicle Details</th>
                    <th>Driver Details</th>
                    <th>Timing (Pickup/Drop)</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">No trips recorded.</td>
                    </tr>
                  ) : (
                    trips.map((trip) => (
                      <tr key={trip.id}>
                        <td>#{trip.id}</td>
                        <td><strong>{trip.tripName}</strong></td>
                        <td>{trip.route ? trip.route.routeName : 'N/A'}</td>
                        <td>
                          {trip.vehicle ? (
                            <>
                              <div>{trip.vehicle.vehicleNumber}</div>
                              <small className="text-muted">{trip.vehicle.vehicleModel}</small>
                            </>
                          ) : 'N/A'}
                        </td>
                        <td>{trip.driver ? trip.driver.driverName : 'N/A'}</td>
                        <td>
                          <div>P: {trip.pickupTime}</div>
                          <div>D: {trip.dropTime}</div>
                        </td>
                        <td>{trip.tripDate}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(trip.tripStatus)} px-3 py-2`}>
                            {trip.tripStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripListView;
