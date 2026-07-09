import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndHistory = async () => {
    try {
      const pRes = await api.get(`/employee/profile/${user.id}`);
      setEmployeeProfile(pRes.data);

      const hRes = await api.get(`/employee/bookings/history/${pRes.data.id}`);
      setHistory(hRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileAndHistory();
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.put(`/employee/bookings/${id}/cancel`);
        alert('Booking cancelled successfully.');
        fetchProfileAndHistory();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'CONFIRMED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">My Bookings Log</h1>

      <div className="card bg-secondary text-white border-0 shadow-sm">
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
                    <th>Booking ID</th>
                    <th>Booking Date</th>
                    <th>Pickup Location</th>
                    <th>Drop Location</th>
                    <th>Trip Status</th>
                    <th>Booking Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-3 text-muted">No booking requests found.</td>
                    </tr>
                  ) : (
                    history.map((b) => (
                      <tr key={b.id}>
                        <td>#{b.id}</td>
                        <td>{b.bookingDate}</td>
                        <td>{b.pickupLocation}</td>
                        <td>{b.dropLocation}</td>
                        <td>
                          {b.trip ? (
                            <span className="small">
                              Trip #{b.trip.id} ({b.trip.tripStatus})
                            </span>
                          ) : (
                            <span className="text-muted small">Not Assigned</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(b.bookingStatus)}`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td>
                          {b.bookingStatus !== 'CANCELLED' && (!b.trip || (b.trip.tripStatus !== 'Started' && b.trip.tripStatus !== 'Completed')) ? (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(b.id)}>
                              Cancel
                            </button>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
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

export default BookingHistory;
