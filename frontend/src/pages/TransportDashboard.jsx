import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TransportDashboard = () => {
  const [metrics, setMetrics] = useState({
    vehicles: 0,
    drivers: 0,
    trips: 0,
    pendingBookings: 0
  });
  const [pendingList, setPendingList] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const vRes = await api.get('/transport/vehicles');
      const dRes = await api.get('/transport/drivers');
      const tRes = await api.get('/transport/trips');
      const bRes = await api.get('/transport/bookings');

      const unassignedBookings = bRes.data.filter(b => b.bookingStatus === 'PENDING');
      
      setMetrics({
        vehicles: vRes.data.length,
        drivers: dRes.data.length,
        trips: tRes.data.length,
        pendingBookings: unassignedBookings.length
      });
      setPendingList(unassignedBookings.slice(0, 5)); 
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Transport Team Dashboard</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase font-monospace text-light">Total Vehicles</h6>
              <h2 className="fw-bold">{metrics.vehicles}</h2>
              <Link to="/transport/vehicles" className="text-white small text-decoration-none">Manage Inductions →</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase font-monospace text-light">Total Drivers</h6>
              <h2 className="fw-bold">{metrics.drivers}</h2>
              <Link to="/transport/drivers" className="text-white small text-decoration-none">Manage Drivers →</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-dark border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase font-monospace text-muted">All Scheduled Trips</h6>
              <h2 className="fw-bold">{metrics.trips}</h2>
              <Link to="/transport/trips" className="text-dark small text-decoration-none fw-bold">Schedule Trips →</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-uppercase font-monospace text-light">Pending Bookings</h6>
              <h2 className="fw-bold">{metrics.pendingBookings}</h2>
              <Link to="/transport/trips" className="text-white small text-decoration-none">Assign Now →</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Recent Cab Booking Requests</h5>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Route (Pickup/Drop)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingList.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-3 text-muted">No pending bookings. All employees are mapped!</td>
                      </tr>
                    ) : (
                      pendingList.map((b) => (
                        <tr key={b.id}>
                          <td><strong>{b.employee.user.name}</strong> ({b.employee.employeeId})</td>
                          <td>P: {b.pickupLocation} | D: {b.dropLocation}</td>
                          <td><span className="badge bg-warning text-dark">{b.bookingStatus}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-end">
                <Link to="/transport/trips" className="btn btn-sm btn-outline-light">Open Trip Assignment Board</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Transport Team Workflow</h5>
            </div>
            <div className="card-body p-4">
              <ol className="list-group list-group-numbered bg-dark text-white rounded">
                <li className="list-group-item bg-transparent text-white border-secondary">
                  <strong>Induct Vehicle:</strong> Add details in the Vehicle module (Starts as <em>UNAPPROVED</em>).
                </li>
                <li className="list-group-item bg-transparent text-white border-secondary">
                  <strong>Induct Driver:</strong> Onboard new drivers and link their Admin usernames.
                </li>
                <li className="list-group-item bg-transparent text-white border-secondary">
                  <strong>Map Driver-Vehicle:</strong> Pair them under Mappings and submit for Admin review.
                </li>
                <li className="list-group-item bg-transparent text-white border-secondary">
                  <strong>Wait for Approval:</strong> Admin must approve the Vehicle, Driver, and Mapping.
                </li>
                <li className="list-group-item bg-transparent text-white border-secondary">
                  <strong>Plan Trips:</strong> Go to Trip assignment, pair approved mappings with routes, and assign employee bookings.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;
