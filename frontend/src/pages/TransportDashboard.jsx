import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Car, Users, Navigation, Clock, ArrowRight, ListChecks } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const TransportDashboard = () => {
  const [metrics, setMetrics] = useState({ vehicles: 0, drivers: 0, trips: 0, pendingBookings: 0 });
  const [pendingList, setPendingList] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const vRes = await api.get('/transport/vehicles');
      const dRes = await api.get('/transport/drivers');
      const tRes = await api.get('/transport/trips');
      const bRes = await api.get('/transport/bookings');
      const unassignedBookings = bRes.data.filter(b => b.bookingStatus === 'PENDING');
      setMetrics({ vehicles: vRes.data.length, drivers: dRes.data.length, trips: tRes.data.length, pendingBookings: unassignedBookings.length });
      setPendingList(unassignedBookings.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const statCards = [
    { title: 'Total Vehicles', value: metrics.vehicles, icon: Car, gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)', link: '/transport/vehicles', linkText: 'Manage Inductions' },
    { title: 'Total Drivers', value: metrics.drivers, icon: Users, gradient: 'linear-gradient(135deg, #34d399, #10b981)', link: '/transport/drivers', linkText: 'Manage Drivers' },
    { title: 'Scheduled Trips', value: metrics.trips, icon: Navigation, gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)', link: '/transport/trips', linkText: 'Schedule Trips' },
    { title: 'Pending Bookings', value: metrics.pendingBookings, icon: Clock, gradient: 'linear-gradient(135deg, #f87171, #ef4444)', link: '/transport/trips', linkText: 'Assign Now' },
  ];

  return (
    <div className="pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="fw-bold mb-1">Transport Team Dashboard</h1>
        <p className="text-secondary small mb-0">Monitor fleet metrics, manage bookings, and coordinate trips.</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className="row g-3 mb-4" variants={containerVariants} initial="hidden" animate="show">
        {statCards.map((card, idx) => (
          <motion.div key={idx} variants={itemVariants} className="col-6 col-md-3" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <div className="glass-panel rounded-4 p-3 h-100 position-relative overflow-hidden">
              <div className="position-absolute top-0 end-0 p-3 opacity-10" style={{ transform: 'scale(2)' }}>
                <card.icon size={40} />
              </div>
              <div className="d-flex flex-column gap-1">
                <span className="text-secondary small fw-medium">{card.title}</span>
                <span className="fw-bold" style={{ fontSize: '2rem', lineHeight: 1, background: card.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{card.value}</span>
                <Link to={card.link} className="text-primary small text-decoration-none d-flex align-items-center gap-1 mt-1">
                  {card.linkText} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="row g-4">
        {/* Pending Bookings Table */}
        <div className="col-lg-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-panel rounded-4 overflow-hidden">
              <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={22} className="text-warning" />
                    <h5 className="mb-0 fw-bold">Recent Booking Requests</h5>
                  </div>
                  <Link to="/transport/trips" className="btn btn-sm glass-panel text-white border-0 px-3 py-2 rounded-3 d-flex align-items-center gap-1">
                    Open Board <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <div className="table-responsive">
                  <table className="table align-middle mb-0" style={{ color: 'var(--text-primary)' }}>
                    <thead>
                      <tr style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <th className="text-secondary small fw-medium border-0">Employee</th>
                        <th className="text-secondary small fw-medium border-0">Route</th>
                        <th className="text-secondary small fw-medium border-0">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingList.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-secondary border-0">
                            <Navigation size={32} className="mb-2 opacity-50" />
                            <p className="mb-0 small">No pending bookings. All employees are mapped!</p>
                          </td>
                        </tr>
                      ) : (
                        pendingList.map((b) => (
                          <tr key={b.id} style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                            <td className="border-0">
                              <strong>{b.employee.user.name}</strong>
                              <div className="text-secondary small">{b.employee.employeeId}</div>
                            </td>
                            <td className="border-0">
                              <div className="small">📍 {b.pickupLocation}</div>
                              <div className="small text-secondary">🏁 {b.dropLocation}</div>
                            </td>
                            <td className="border-0">
                              <span className="badge rounded-pill" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                                {b.bookingStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Workflow Guide */}
        <div className="col-lg-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass-panel rounded-4 overflow-hidden">
              <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center gap-2">
                  <ListChecks size={22} className="text-primary" />
                  <h5 className="mb-0 fw-bold">Transport Team Workflow</h5>
                </div>
              </div>
              <div className="p-4">
                <div className="d-flex flex-column gap-3">
                  {[
                    { num: '1', title: 'Induct Vehicle', desc: 'Add vehicle details. Starts as UNAPPROVED.' },
                    { num: '2', title: 'Induct Driver', desc: 'Onboard new drivers and link their accounts.' },
                    { num: '3', title: 'Map Driver-Vehicle', desc: 'Pair them under Mappings for Admin review.' },
                    { num: '4', title: 'Wait for Approval', desc: 'Admin must approve the Vehicle, Driver & Mapping.' },
                    { num: '5', title: 'Plan Trips', desc: 'Pair approved mappings with routes, assign employee bookings.' },
                  ].map((step) => (
                    <div key={step.num} className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex-shrink-0 rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                        {step.num}
                      </div>
                      <div>
                        <p className="fw-semibold mb-0 small">{step.title}</p>
                        <p className="text-secondary mb-0" style={{ fontSize: '0.8rem' }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;
