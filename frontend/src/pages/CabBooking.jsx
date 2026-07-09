import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CabBooking = () => {
  const { user } = useContext(AuthContext);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/employee/profile/${user.id}`);
        setEmployeeProfile(response.data);
        setPickupLocation(response.data.address || '');
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!pickupLocation || !dropLocation) {
      setError('Both pickup and drop locations are required');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/employee/bookings/${employeeProfile.id}`, {
        pickupLocation,
        dropLocation
      });
      setMessage('Cab booked successfully! Pending transport team route assignment.');
      setDropLocation('');
      setTimeout(() => {
        navigate('/employee/history');
      }, 2000);
    } catch (err) {
      setError('Failed to book cab request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Request Cab Booking</h1>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Cab Booking Details</h5>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger p-2">{error}</div>}
              {message && <div className="alert alert-success p-2">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Pickup Location</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Enter pickup address"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                  <div className="form-text text-muted" style={{ fontSize: '0.8rem' }}>
                    Defaults to your registered profile address.
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Drop Location</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Enter destination (e.g. Office Hub A)"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading || !employeeProfile}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabBooking;
