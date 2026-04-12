import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { ImageUpload } from '../components/ImageUpload';
import './css-pages/ProfilePage.css';

export function ProfilePage() {
  const { user, setUser } = useAuth(); // Assuming there's a setUser in context
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    gig: '',
    description: '',
    title: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        image: user.image || '',
        gig: user.gig || '',
        description: user.description || '',
        title: user.title || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/User/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // Update local auth context
        if (setUser) {
          setUser({ ...user, ...updatedUser });
        }
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="profile-loading">Please login to view profile.</div>;

  const isProfessional = user.type === 'Instructor' || user.type === 'Broker';

  return (
    <div className="profile-page-wrapper">
      <Header />
      <main className="profile-container">
        <div className="profile-card">
          <header className="profile-header">
            <div className="profile-badge">{user.type} Profile</div>
            <h1>Customize Your Presence</h1>
            <p>Manage your account information and how you appear to others.</p>
          </header>

          <form className="profile-form" onSubmit={handleSubmit}>
            {message.text && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <ImageUpload
                label="Profile Picture"
                initialImage={formData.image}
                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
              />
            </div>

            {isProfessional && (
              <div className="form-section professional-section">
                <h3>Professional Identity</h3>
                
                <div className="form-group">
                  <label htmlFor="title">Professional Headline / Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Forex Analyst & Mentor"
                  />
                </div>

                  <ImageUpload
                    label="Gigs / Banner Image"
                    initialImage={formData.gig}
                    onUploadSuccess={(url) => setFormData({ ...formData, gig: url })}
                  />

                <div className="form-group">
                  <label htmlFor="description">About You / Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell your students or clients about your experience..."
                  ></textarea>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Profile Settings'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <HomePageFutter />
    </div>
  );
}
