import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [assignedTrip, setAssignedTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  const fetchProfileAndTrip = async () => {
    try {
      const pRes = await api.get(`/employee/profile/${user.id}`);
      const emp = pRes.data;
      setEmployeeProfile(emp);
      setName(emp.user.name);
      setEmail(emp.user.email);
      setPhoneNumber(emp.phoneNumber || '');
      setAddress(emp.address || '');

      const tRes = await api.get(`/employee/assigned-trip/${emp.id}`);
      if (tRes.status === 200 && tRes.data) {
        setAssignedTrip(tRes.data.trip);
      } else {
        setAssignedTrip(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileAndTrip();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const response = await api.put(`/employee/profile/${employeeProfile.id}`, {
        name,
        email,
        phoneNumber,
        address
      });
      setEmployeeProfile(response.data);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setProfileMsg('Failed to update profile.');
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

  if (loading) {
    return (
      <div className="text-center py-5 bg-dark text-white min-vh-100">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Employee Terminal</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card bg-secondary text-white border-0 shadow-sm mb-4">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">My Assigned Cab</h5>
            </div>
            <div className="card-body p-4">
              {assignedTrip ? (
                <div>
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/>
                    </svg>
                    <div>Your transportation is confirmed! Trip Status: <strong>{assignedTrip.tripStatus}</strong></div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6 border-end border-secondary">
                      <h6 className="text-uppercase text-light small font-monospace">Vehicle Details</h6>
                      <h4 className="fw-bold mt-1 text-info">{assignedTrip.vehicle?.vehicleNumber}</h4>
                      <p className="mb-1">{assignedTrip.vehicle?.vehicleModel} ({assignedTrip.vehicle?.vehicleType})</p>
                      <p className="small text-muted mb-0">Fuel: {assignedTrip.vehicle?.fuelType}</p>
                    </div>

                    <div className="col-md-6 ps-md-4">
                      <h6 className="text-uppercase text-light small font-monospace">Driver Details</h6>
                      <h5 className="fw-bold mt-1">{assignedTrip.driver?.driverName}</h5>
                      <p className="mb-1">Phone: <strong>{assignedTrip.driver?.phoneNumber}</strong></p>
                      <p className="small text-muted mb-0">Experience: {assignedTrip.driver?.experience} Years</p>
                    </div>
                  </div>
                  
                  <hr className="border-secondary my-4" />

                  <div className="row g-3">
                    <div className="col-md-6">
                      <h6 className="text-uppercase text-light small font-monospace">Route Name</h6>
                      <h5>{assignedTrip.route?.routeName}</h5>
                      <p className="small text-muted mb-0">{assignedTrip.route?.startDestination} → {assignedTrip.route?.endDestination}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-uppercase text-light small font-monospace">Timing & Date</h6>
                      <div>Pickup: <strong>{assignedTrip.pickupTime}</strong></div>
                      <div>Drop: <strong>{assignedTrip.dropTime}</strong></div>
                      <div className="small text-muted mt-1">Date: {assignedTrip.tripDate}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <svg width="48" height="48" fill="currentColor" className="text-muted mb-3" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                  </svg>
                  <h5>No cab assigned for today</h5>
                  <p className="text-muted mb-0 small">Please make a booking request or contact the Transport Team if you have a scheduling issue.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card bg-secondary text-white border-0 shadow-sm mb-4">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">My Profile</h5>
            </div>
            <div className="card-body p-4">
              {profileMsg && <div className="alert alert-info p-2">{profileMsg}</div>}
              <form onSubmit={handleProfileUpdate}>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small">Name</label>
                    <input type="text" className="form-control form-control-sm bg-dark text-white border-secondary" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label small">Email</label>
                    <input type="email" className="form-control form-control-sm bg-dark text-white border-secondary" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small">Phone Number</label>
                  <input type="text" className="form-control form-control-sm bg-dark text-white border-secondary" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label className="form-label small">Home Address</label>
                  <textarea className="form-control form-control-sm bg-dark text-white border-secondary" rows="2" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                </div>

                <button type="submit" className="btn btn-sm btn-primary w-100 py-2">Update Profile Info</button>
              </form>
            </div>
          </div>

          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Change Password</h5>
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
      </div>
    </div>
  );
};

export default EmployeeDashboard;
