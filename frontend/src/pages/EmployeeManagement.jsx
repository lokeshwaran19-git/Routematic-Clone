import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/employees', {
        params: { query, page, size: 5 }
      });
      setEmployees(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee? This will also delete their login account.")) {
      try {
        await api.delete(`/admin/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error(err);
        alert('Failed to delete employee');
      }
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee({
      id: employee.id,
      employeeId: employee.employeeId,
      department: employee.department,
      phoneNumber: employee.phoneNumber || '',
      address: employee.address || '',
      user: {
        name: employee.user.name,
        email: employee.user.email
      }
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee({ ...editingEmployee, [name]: value });
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee({
      ...editingEmployee,
      user: { ...editingEmployee.user, [name]: value }
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/employees/${editingEmployee.id}`, editingEmployee);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert('Failed to update employee');
    }
  };

  return (
    <div className="container-fluid py-4 bg-dark text-white min-vh-100">
      <h1 className="fw-bold mb-4">Employee Management</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-secondary text-white border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Search by name, ID or department..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-4">Search</button>
              </form>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-light" role="status"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-3 text-muted">No employees found.</td>
                        </tr>
                      ) : (
                        employees.map((emp) => (
                          <tr key={emp.id}>
                            <td>{emp.employeeId}</td>
                            <td>{emp.user.name}</td>
                            <td>{emp.user.email}</td>
                            <td>{emp.department}</td>
                            <td>{emp.phoneNumber || 'N/A'}</td>
                            <td>
                              <button className="btn btn-sm btn-info me-2" onClick={() => handleEditClick(emp)}>Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button className="btn btn-outline-light btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Previous
                  </button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button className="btn btn-outline-light btn-sm" disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {editingEmployee ? (
            <div className="card bg-secondary text-white border-0 shadow-sm">
              <div className="card-header bg-dark border-bottom border-secondary">
                <h5 className="mb-0 fw-bold">Edit Employee</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="name" value={editingEmployee.user.name} onChange={handleEditUserChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control bg-dark text-white border-secondary" name="email" value={editingEmployee.user.email} onChange={handleEditUserChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Employee ID</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="employeeId" value={editingEmployee.employeeId} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="department" value={editingEmployee.department} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" name="phoneNumber" value={editingEmployee.phoneNumber} onChange={handleEditChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className="form-control bg-dark text-white border-secondary" name="address" rows="2" value={editingEmployee.address} onChange={handleEditChange}></textarea>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success flex-grow-1">Save Changes</button>
                    <button type="button" className="btn btn-outline-light" onClick={() => setEditingEmployee(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card bg-secondary text-white border-0 shadow-sm p-4 text-center text-muted">
              <p className="mb-0">Select an employee from the table to edit their details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
