import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Car, User, Phone, Home, Lock, CheckCircle, AlertCircle, MapPin, Clock } from 'lucide-react';

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
    if (user) fetchProfileAndTrip();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const response = await api.put(`/employee/profile/${employeeProfile.id}`, { name, email, phoneNumber, address });
      setEmployeeProfile(response.data);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg('Failed to update profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdErr('');
    if (!oldPassword || !newPassword || !confirmPassword) { setPwdErr('All fields are required'); return; }
    if (newPassword !== confirmPassword) { setPwdErr('New passwords do not match'); return; }
    try {
      await api.post('/auth/change-password', { userId: user.id, oldPassword, newPassword });
      setPwdMsg('Password updated successfully!');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPwdErr(err.response?.data?.message || 'Password update failed');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="text-secondary">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="fw-bold mb-1">Employee Terminal</h1>
        <p className="text-secondary small mb-0">View your assigned cab, manage your profile, and update your password.</p>
      </motion.div>

      <div className="row g-4">
        {/* Assigned Cab Column */}
        <div className="col-lg-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-panel rounded-4 overflow-hidden mb-4">
              <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center gap-2">
                  <Car size={22} className="text-primary" />
                  <h5 className="mb-0 fw-bold">My Assigned Cab</h5>
                </div>
              </div>
              <div className="p-4">
                {assignedTrip ? (
                  <div>
                    <div className="d-flex align-items-center gap-2 p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 mb-4">
                      <CheckCircle size={20} className="text-success flex-shrink-0" />
                      <span className="text-success fw-medium">Transportation confirmed! Status: <strong>{assignedTrip.tripStatus}</strong></span>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <p className="text-secondary small fw-medium text-uppercase mb-2">Vehicle</p>
                          <h4 className="fw-bold text-primary mb-1">{assignedTrip.vehicle?.vehicleNumber}</h4>
                          <p className="mb-1 small">{assignedTrip.vehicle?.vehicleModel} ({assignedTrip.vehicle?.vehicleType})</p>
                          <p className="small text-secondary mb-0">Fuel: {assignedTrip.vehicle?.fuelType}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <p className="text-secondary small fw-medium text-uppercase mb-2">Driver</p>
                          <h5 className="fw-bold mb-1">{assignedTrip.driver?.driverName}</h5>
                          <p className="mb-1 small">📞 {assignedTrip.driver?.phoneNumber}</p>
                          <p className="small text-secondary mb-0">Exp: {assignedTrip.driver?.experience} Years</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-top my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}></div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-start gap-2">
                          <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-secondary small fw-medium mb-1">Route</p>
                            <p className="fw-semibold mb-0">{assignedTrip.route?.routeName}</p>
                            <p className="small text-secondary">{assignedTrip.route?.startDestination} → {assignedTrip.route?.endDestination}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-start gap-2">
                          <Clock size={18} className="text-primary mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-secondary small fw-medium mb-1">Timing</p>
                            <p className="fw-semibold mb-0">Pickup: {assignedTrip.pickupTime}</p>
                            <p className="small text-secondary">Drop: {assignedTrip.dropTime} | {assignedTrip.tripDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <AlertCircle size={48} className="text-secondary mb-3" />
                    <h5 className="fw-semibold mb-2">No cab assigned for today</h5>
                    <p className="text-secondary small mb-0">Please book a cab or contact the Transport Team if you have a scheduling issue.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile & Password Column */}
        <div className="col-lg-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-panel rounded-4 overflow-hidden mb-4">
              <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center gap-2">
                  <User size={22} className="text-primary" />
                  <h5 className="mb-0 fw-bold">My Profile</h5>
                </div>
              </div>
              <div className="p-4">
                {profileMsg && (
                  <div className={`alert border-0 rounded-3 p-3 mb-3 small ${profileMsg.includes('success') ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                    {profileMsg}
                  </div>
                )}
                <form onSubmit={handleProfileUpdate}>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label text-secondary small fw-medium">Name</label>
                      <input type="text" className="form-control form-control-sm" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-secondary small fw-medium">Email</label>
                      <input type="email" className="form-control form-control-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-medium">Phone Number</label>
                    <input type="text" className="form-control form-control-sm" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-medium">Home Address</label>
                    <textarea className="form-control form-control-sm" rows="2" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary w-100 py-2 btn-sm d-flex align-items-center justify-content-center gap-2">
                    <User size={16} /> Update Profile
                  </motion.button>
                </form>
              </div>
            </div>

            <div className="glass-panel rounded-4 overflow-hidden">
              <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center gap-2">
                  <Lock size={22} className="text-warning" />
                  <h5 className="mb-0 fw-bold">Change Password</h5>
                </div>
              </div>
              <div className="p-4">
                {pwdMsg && <div className="alert border-0 rounded-3 p-3 mb-3 small bg-success bg-opacity-10 text-success">{pwdMsg}</div>}
                {pwdErr && <div className="alert border-0 rounded-3 p-3 mb-3 small bg-danger bg-opacity-10 text-danger">{pwdErr}</div>}
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-medium">Current Password</label>
                    <input type="password" className="form-control form-control-sm" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-medium">New Password</label>
                    <input type="password" className="form-control form-control-sm" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-medium">Confirm New Password</label>
                    <input type="password" className="form-control form-control-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn w-100 py-2 btn-sm d-flex align-items-center justify-content-center gap-2" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#000' }}>
                    <Lock size={16} /> Update Password
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
