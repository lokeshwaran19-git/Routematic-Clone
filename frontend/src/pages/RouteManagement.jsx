import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    routeName: '',
    startDestination: '',
    endDestination: '',
    stops: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/admin/routes');
      setRoutes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.routeName || !formData.startDestination || !formData.endDestination) {
      setError('Route Name, Start and End destinations are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/routes', formData);
      setMessage('Route added successfully!');
      setFormData({
        routeName: '',
        startDestination: '',
        endDestination: '',
        stops: ''
      });
      fetchRoutes();
    } catch (err) {
      setError('Failed to add route');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await api.delete(`/admin/routes/${id}`);
        fetchRoutes();
      } catch (err) {
        console.error(err);
        alert('Failed to delete route');
      }
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Route Management</h1>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Add Transit Route</h5>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger p-2">{error}</div>}
              {message && <div className="alert alert-success p-2">{message}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Route Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    name="routeName"
                    value={formData.routeName}
                    onChange={handleChange}
                    placeholder="e.g. Route A - North Hub"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Destination</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    name="startDestination"
                    value={formData.startDestination}
                    onChange={handleChange}
                    placeholder="e.g. Office Campus"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Destination</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    name="endDestination"
                    value={formData.endDestination}
                    onChange={handleChange}
                    placeholder="e.g. Metro Station Sector 5"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Intermediate Stops (Comma separated)</label>
                  <textarea
                    className="form-control bg-dark text-white border-secondary"
                    name="stops"
                    rows="3"
                    value={formData.stops}
                    onChange={handleChange}
                    placeholder="Stop 1, Stop 2, Stop 3..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Create Route
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-header bg-dark border-bottom border-secondary">
              <h5 className="mb-0 fw-bold">Available Routes</h5>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Route Name</th>
                      <th>Start Point</th>
                      <th>End Point</th>
                      <th>Stops</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-3 text-muted">No routes registered yet.</td>
                      </tr>
                    ) : (
                      routes.map((route) => (
                        <tr key={route.id}>
                          <td><strong>{route.routeName}</strong></td>
                          <td>{route.startDestination}</td>
                          <td>{route.endDestination}</td>
                          <td>
                            <small className="text-muted">{route.stops || 'Direct Route (No intermediate stops)'}</small>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(route.id)}>
                              Delete
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
    </div>
  );
};

export default RouteManagement;
