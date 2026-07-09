import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Lock, RefreshCw, CheckCircle, XCircle, PlayCircle, Users } from 'lucide-react';

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

  useEffect(() => { if (user) fetchProfileAndTrips(); }, [user]);

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
    setPwdMsg(''); setPwdErr('');
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled': return { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: 'rgba(96,165,250,0.3)' };
      case 'Started': return { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' };
      case 'Completed': return { bg: 'rgba(52,211,153,0.15)', color: '#34d399', border: 'rgba(52,211,153,0.3)' };
      case 'Cancelled': return { bg: 'rgba(248,113,113,0.15)', color: '#f87171', border: 'rgba(248,113,113,0.3)' };
      default: return { bg: 'rgba(255,255,255,0.1)', color: '#a1a1aa', border: 'rgba(255,255,255,0.2)' };
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="text-secondary">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3"
      >
        <div>
          <h1 className="fw-bold mb-1">Driver Terminal</h1>
          <p className="text-secondary small mb-0">View your assigned trips, update their status, and manage your account.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {driverProfile && (
            <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
              ✓ {driverProfile.approvalStatus}
            </span>
          )}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="btn btn-sm glass-panel text-white border-0 d-flex align-items-center gap-2 px-3 py-2 rounded-3"
            onClick={fetchProfileAndTrips}
          >
            <RefreshCw size={16} /> Refresh
          </motion.button>
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Trips Table */}
        <div className="col-lg-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-panel rounded-4 overflow-hidden mb-4">
              <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={22} className="text-primary" />
                  <h5 className="mb-0 fw-bold">Assigned Trips</h5>
                </div>
              </div>
              <div className="p-4">
                <div className="table-responsive">
                  <table className="table align-middle mb-0" style={{ color: 'var(--text-primary)' }}>
                    <thead>
                      <tr style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <th className="text-secondary small fw-medium border-0">Trip</th>
                        <th className="text-secondary small fw-medium border-0">Route</th>
                        <th className="text-secondary small fw-medium border-0">Status</th>
                        <th className="text-secondary small fw-medium border-0"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-secondary border-0">
                            <MapPin size={32} className="mb-2 opacity-50" />
                            <p className="mb-0 small">No trips assigned to you yet.</p>
                          </td>
                        </tr>
                      ) : (
                        trips.map((t) => {
                          const style = getStatusStyle(t.tripStatus);
                          return (
                            <tr key={t.id} style={{ borderColor: 'rgba(255,255,255,0.07)', cursor: 'pointer' }}
                              onClick={() => handleTripSelect(t)}
                            >
                              <td className="border-0">
                                <strong>{t.tripName}</strong>
                                <div className="text-secondary small">#{t.id}</div>
                              </td>
                              <td className="border-0">
                                <div className="small">{t.route?.routeName || 'N/A'}</div>
                                <div className="text-secondary small">{t.pickupTime} / {t.dropTime}</div>
                              </td>
                              <td className="border-0">
                                <span className="badge rounded-pill small" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                                  {t.tripStatus}
                                </span>
                              </td>
                              <td className="border-0">
                                <motion.button
                                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  className="btn btn-sm glass-panel text-white border-0 px-3 py-1 rounded-3"
                                  onClick={(e) => { e.stopPropagation(); handleTripSelect(t); }}
                                >
                                  View
                                </motion.button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="glass-panel rounded-4 overflow-hidden">
              <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center gap-2">
                  <Lock size={22} className="text-warning" />
                  <h5 className="mb-0 fw-bold">Update Password</h5>
                </div>
              </div>
              <div className="p-4">
                {pwdMsg && <div className="alert border-0 rounded-3 p-3 mb-3 small bg-success bg-opacity-10 text-success">{pwdMsg}</div>}
                {pwdErr && <div className="alert border-0 rounded-3 p-3 mb-3 small bg-danger bg-opacity-10 text-danger">{pwdErr}</div>}
                <form onSubmit={handlePasswordChange}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-medium">Current Password</label>
                      <input type="password" className="form-control form-control-sm" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-medium">New Password</label>
                      <input type="password" className="form-control form-control-sm" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-medium">Confirm New Password</label>
                      <input type="password" className="form-control form-control-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                      className="btn btn-sm px-4 py-2 d-flex align-items-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#000' }}
                    >
                      <Lock size={16} /> Update Password
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trip Detail Panel */}
        <div className="col-lg-5">
          <AnimatePresence mode="wait">
            {selectedTrip ? (
              <motion.div key={selectedTrip.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="glass-panel rounded-4 overflow-hidden">
                  <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <h5 className="mb-0 fw-bold">Trip #{selectedTrip.id}</h5>
                    {(() => {
                      const style = getStatusStyle(selectedTrip.tripStatus);
                      return (
                        <span className="badge rounded-pill px-3 py-2" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                          {selectedTrip.tripStatus}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="p-4">
                    <h4 className="fw-bold text-primary mb-3">{selectedTrip.tripName}</h4>
                    <div className="d-flex flex-column gap-2 mb-4">
                      <div className="d-flex justify-content-between small">
                        <span className="text-secondary">Vehicle</span>
                        <span className="fw-medium">{selectedTrip.vehicle?.vehicleNumber} ({selectedTrip.vehicle?.vehicleModel})</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-secondary">Route</span>
                        <span className="fw-medium">{selectedTrip.route?.routeName}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-secondary">Pickup</span>
                        <span className="fw-medium">{selectedTrip.pickupTime}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-secondary">Drop</span>
                        <span className="fw-medium">{selectedTrip.dropTime}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mb-4">
                      {selectedTrip.tripStatus === 'Scheduled' && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: 'none', color: '#000' }}
                          onClick={() => handleStatusUpdate(selectedTrip.id, 'Started')}
                        >
                          <PlayCircle size={16} /> Start Trip
                        </motion.button>
                      )}
                      {selectedTrip.tripStatus === 'Started' && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                          onClick={() => handleStatusUpdate(selectedTrip.id, 'Completed')}
                        >
                          <CheckCircle size={16} /> Complete Trip
                        </motion.button>
                      )}
                      {(selectedTrip.tripStatus === 'Scheduled' || selectedTrip.tripStatus === 'Started') && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="btn glass-panel text-danger border-0 d-flex align-items-center gap-1"
                          onClick={() => handleStatusUpdate(selectedTrip.id, 'Cancelled')}
                        >
                          <XCircle size={16} /> Cancel
                        </motion.button>
                      )}
                    </div>

                    <div className="border-top pt-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <Users size={18} className="text-primary" />
                        <h6 className="mb-0 fw-bold">Assigned Passengers ({passengers.length})</h6>
                      </div>
                      {passengers.length === 0 ? (
                        <p className="text-secondary small">No passengers assigned yet.</p>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          {passengers.map((b) => (
                            <div key={b.id} className="p-3 rounded-3 d-flex justify-content-between align-items-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                              <div>
                                <p className="fw-semibold mb-0 small">{b.employee.user.name}</p>
                                <p className="text-secondary mb-0" style={{ fontSize: '0.75rem' }}>{b.employee.phoneNumber || 'N/A'}</p>
                              </div>
                              <div className="text-end">
                                <p className="mb-0" style={{ fontSize: '0.75rem' }}>📍 {b.pickupLocation}</p>
                                <p className="text-secondary mb-0" style={{ fontSize: '0.75rem' }}>🏁 {b.dropLocation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="glass-panel rounded-4 p-5 text-center">
                  <MapPin size={48} className="text-secondary mb-3 opacity-50" />
                  <h5 className="fw-semibold mb-2">Select a Trip</h5>
                  <p className="text-secondary small mb-0">Click a trip from the table to view details, see passengers, and update status.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
