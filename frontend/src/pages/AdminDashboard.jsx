import { useEffect, useState } from 'react';
import './css-pages/AdminDashboard.css';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    _id: '', name: '', email: '', mobile: '', pan: '', dob: '', password: '', type: 'Learner',
    coins: 100000, gig: '', rating: 0, image: '', description: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/User/all');
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/User/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ 
      _id: '', name: '', email: '', mobile: '', pan: '', dob: '', password: '', type: 'Learner',
      coins: 100000, gig: '', rating: 0, image: '', description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (targetUser) => {
    setModalMode('edit');
    setFormData({ ...targetUser, password: '' });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const res = await fetch('http://localhost:5000/User/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          fetchUsers();
          setIsModalOpen(false);
        } else {
          const result = await res.json();
          alert(result.error || "Failed to add user");
        }
      } else {
        // Edit mode
        const updates = { ...formData };
        if (!updates.password) delete updates.password; // don't send empty password

        const res = await fetch(`http://localhost:5000/User/${formData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          fetchUsers();
          setIsModalOpen(false);
        } else {
          alert("Failed to update user");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  const filteredUsers = activeTab === 'All' ? users : users.filter(u => u.type === activeTab);
  const tabs = ['All', 'Learner', 'Instructor', 'Broker', 'Admin'];

  return (
    <>
      <Header />
      <div className="admin-container">
        
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage users, adjust roles, and monitor platform activity.</p>
          </div>
          <button className="admin-add-btn" onClick={openAddModal}>+ Add User</button>
        </div>

        <div className="admin-tabs">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div>Loading user data...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-th">Name</th>
                  <th className="admin-th">Email</th>
                  <th className="admin-th">Role</th>
                  <th className="admin-th">PAN</th>
                  <th className="admin-th">Phone</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="admin-tr">
                    <td className="admin-td admin-td-name">{u.name}</td>
                    <td className="admin-td">{u.email}</td>
                    <td className="admin-td">
                      <span className={`admin-badge badge-${u.type.toLowerCase()}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="admin-td">{u.pan}</td>
                    <td className="admin-td">{u.mobile}</td>
                    <td className="admin-td admin-actions">
                      <button 
                        className="admin-action-btn btn-edit" 
                        onClick={() => openEditModal(u)}
                        disabled={u.type === 'Admin' && u._id !== user?.id}
                        style={{ opacity: u.type === 'Admin' && u._id !== user?.id ? 0.4 : 1, cursor: u.type === 'Admin' && u._id !== user?.id ? 'not-allowed' : 'pointer' }}
                      >Edit</button>
                      <button 
                        className="admin-action-btn btn-delete" 
                        onClick={() => handleDelete(u._id)}
                        disabled={u.type === 'Admin' && u._id !== user?.id}
                        style={{ opacity: u.type === 'Admin' && u._id !== user?.id ? 0.4 : 1, cursor: u.type === 'Admin' && u._id !== user?.id ? 'not-allowed' : 'pointer' }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                      No users found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required className="form-input" name="name" value={formData.name} onChange={handleFormChange} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input required type="email" className="form-input" name="email" value={formData.email} onChange={handleFormChange} placeholder="john@example.com" />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input required className="form-input" name="mobile" value={formData.mobile} onChange={handleFormChange} placeholder="9876543210" />
                </div>
                <div>
                  <label className="form-label">PAN Number</label>
                  <input required className="form-input" name="pan" value={formData.pan} onChange={handleFormChange} placeholder="ABCDE1234F" />
                </div>
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Account Type</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleFormChange}>
                    <option value="Learner">Learner</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Broker">Broker</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input required={modalMode === 'add'} type="date" className="form-input" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={handleFormChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password {modalMode === 'edit' && '(Leave blank to keep current)'}</label>
                <input required={modalMode === 'add'} type="password" className="form-input" name="password" value={formData.password} onChange={handleFormChange} placeholder="••••••••" />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Coins</label>
                  <input type="number" className="form-input" name="coins" value={formData.coins} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="form-label">Rating</label>
                  <input type="number" step="0.1" className="form-input" name="rating" value={formData.rating} onChange={handleFormChange} />
                </div>
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Gig</label>
                  <input type="text" className="form-input" name="gig" value={formData.gig} onChange={handleFormChange} placeholder="e.g. Senior Trader" />
                </div>
                <div>
                  <label className="form-label">Image URL</label>
                  <input type="text" className="form-input" name="image" value={formData.image} onChange={handleFormChange} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" value={formData.description} onChange={handleFormChange} placeholder="Bio..." rows="2"></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
