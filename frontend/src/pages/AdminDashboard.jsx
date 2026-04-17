import { useEffect, useState } from 'react';
import '../styles/dashboard-shell.css';
import './css-pages/AdminDashboard.css';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    email: '',
    mobile: '',
    pan: '',
    dob: '',
    password: '',
    type: 'Learner',
    coins: 100000,
    gig: '',
    rating: 0,
    image: '',
    description: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/User/all`);
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
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/User/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      _id: '',
      name: '',
      email: '',
      mobile: '',
      pan: '',
      dob: '',
      password: '',
      type: 'Learner',
      coins: 100000,
      gig: '',
      rating: 0,
      image: '',
      description: '',
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/User/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          fetchUsers();
          setIsModalOpen(false);
        } else {
          const result = await res.json();
          alert(result.error || 'Failed to add user');
        }
      } else {
        const updates = { ...formData };
        if (!updates.password) delete updates.password;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/User/${formData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          fetchUsers();
          setIsModalOpen(false);
        } else {
          alert('Failed to update user');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving user');
    }
  };

  const filteredUsers = activeTab === 'All' ? users : users.filter((u) => u.type === activeTab);
  const tabs = ['All', 'Learner', 'Instructor', 'Broker', 'Admin'];

  const adminRowLocked = (u) => u.type === 'Admin' && u._id !== user?.id;

  return (
    <>
      <Header />
      <div className="dash-page">
        <div className="dash-inner">
          <header className="dash-hero">
            <div className="dash-hero__top">
              <div>
                <p className="dash-eyebrow">Administration</p>
                <h1 className="dash-title">User directory</h1>
                <p className="dash-lede">
                  Review accounts, filter by role, and keep the platform roster accurate. Changes apply immediately
                  to sign-in and dashboards.
                </p>
              </div>
              <button type="button" className="dash-btn dash-btn--primary" onClick={openAddModal}>
                Add user
              </button>
            </div>
          </header>

          <div className="dash-tabs" role="tablist" aria-label="Filter by role">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                className={`dash-tab ${activeTab === tab ? 'dash-tab--active' : ''}`}
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="dash-load">Loading directory…</div>
          ) : error ? (
            <div className="dash-err" role="alert">
              {error}
            </div>
          ) : (
            <div className="dash-panel">
              <div className="dash-table-wrap">
                <table className="dash-table admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>PAN</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td className="dash-table__title">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`admin-role-pill admin-role-pill--${u.type.toLowerCase()}`}>
                            {u.type}
                          </span>
                        </td>
                        <td>{u.pan}</td>
                        <td>{u.mobile}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className={`dash-action dash-action--edit ${adminRowLocked(u) ? 'is-disabled' : ''}`}
                              onClick={() => openEditModal(u)}
                              disabled={adminRowLocked(u)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className={`dash-action dash-action--danger ${adminRowLocked(u) ? 'is-disabled' : ''}`}
                              onClick={() => handleDelete(u._id)}
                              disabled={adminRowLocked(u)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="admin-table-empty">
                          No users in this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <HomePageFutter />

      {isModalOpen && (
        <div
          className="dash-modal-overlay"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="dash-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>{modalMode === 'add' ? 'Add user' : 'Edit user'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="dash-field">
                <label htmlFor="adm-name">Full name</label>
                <input
                  id="adm-name"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Jane Cooper"
                />
              </div>
              <div className="dash-field">
                <label htmlFor="adm-email">Email</label>
                <input
                  id="adm-email"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="jane@company.com"
                />
              </div>
              <div className="dash-field-row">
                <div className="dash-field">
                  <label htmlFor="adm-mobile">Phone</label>
                  <input
                    id="adm-mobile"
                    required
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleFormChange}
                    placeholder="9876543210"
                  />
                </div>
                <div className="dash-field">
                  <label htmlFor="adm-pan">PAN</label>
                  <input
                    id="adm-pan"
                    required
                    name="pan"
                    value={formData.pan}
                    onChange={handleFormChange}
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
              <div className="dash-field-row">
                <div className="dash-field">
                  <label htmlFor="adm-type">Account type</label>
                  <select id="adm-type" name="type" value={formData.type} onChange={handleFormChange}>
                    <option value="Learner">Learner</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Broker">Broker</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="dash-field">
                  <label htmlFor="adm-dob">Date of birth</label>
                  <input
                    id="adm-dob"
                    required={modalMode === 'add'}
                    type="date"
                    name="dob"
                    value={formData.dob ? formData.dob.split('T')[0] : ''}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="dash-field">
                <label htmlFor="adm-pass">Password {modalMode === 'edit' && '(leave blank to keep)'}</label>
                <input
                  id="adm-pass"
                  required={modalMode === 'add'}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="dash-field-row">
                <div className="dash-field">
                  <label htmlFor="adm-coins">Coins</label>
                  <input
                    id="adm-coins"
                    type="number"
                    name="coins"
                    value={formData.coins}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="dash-field">
                  <label htmlFor="adm-rating">Rating</label>
                  <input
                    id="adm-rating"
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="dash-field-row">
                <div className="dash-field">
                  <label htmlFor="adm-gig">Gig</label>
                  <input id="adm-gig" type="text" name="gig" value={formData.gig} onChange={handleFormChange} />
                </div>
                <div className="dash-field">
                  <label htmlFor="adm-img">Image URL</label>
                  <input id="adm-img" type="text" name="image" value={formData.image} onChange={handleFormChange} />
                </div>
              </div>
              <div className="dash-field">
                <label htmlFor="adm-desc">Description</label>
                <textarea
                  id="adm-desc"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Short bio"
                />
              </div>

              <div className="dash-modal-actions">
                <button type="button" className="dash-btn dash-btn--muted" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-btn dash-btn--primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
