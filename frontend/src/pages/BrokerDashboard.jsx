import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard-shell.css';
import './css-pages/BrokerDashboard.css';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { useAuth } from '../context/AuthContext';
import { ChatInbox } from '../components/ChatInbox';

export function BrokerDashboard() {
  const { user } = useAuth();
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/count/${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setClientCount(data.count);
        }
      } catch (err) {
        console.error('Failed to fetch broker metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [user]);

  return (
    <div className="broker-dash-wrapper">
      <Header />
      <div className="broker-dash-layout">
        <main className="dash-main-content">
          {/* Hero Section */}
          <header className="dash-hero">
            <p className="dash-eyebrow">Professional Account</p>
            <h1 className="dash-title">Broker Command Center</h1>
            <p className="dash-lede">
              Good day, <strong>{user?.name}</strong>. Monitor your client engagement 
              and partnership performance metrics from this centralized command center.
            </p>
          </header>

          {/* Seamless Stats Bar */}
          <section className="dash-stats-bar">
            <div className="stat-item">
              <span className="stat-item__label">Total Clients</span>
              <div className="stat-item__value">{loading ? '...' : clientCount}</div>
              <div className="stat-item__trend trend--up">↑ active</div>
            </div>

            <div className="stat-item">
              <span className="stat-item__label">Avg Rating</span>
              <div className="stat-item__value">{user?.rating || '0.0'}</div>
              <div className="stat-item__trend" style={{color: '#64748b'}}>Verified</div>
            </div>

            <div className="stat-item">
              <span className="stat-item__label">Active Threads</span>
              <div className="stat-item__value">{loading ? '...' : clientCount}</div>
              <div className="stat-item__trend" style={{color: '#64748b'}}>Responding</div>
            </div>
          </section>

          {/* Service Panel */}
          <section className="dash-panel">
            <div className="dash-panel__header">
              <h2>Service Management</h2>
            </div>
            <div className="dash-panel__content">
              <p>
                Configure your professional profile, manage service headlines, and update your banner 
                portfolio to attract more clients. Your visibility is currently set to <strong>Active</strong>.
              </p>
              
              <div className="shortcut-buttons">
                <Link className="shortcut-btn" to="/profile">
                  <span>Manage Profile</span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <aside className="dash-sidebar">
          <ChatInbox userId={user?.id} />
        </aside>
      </div>
      <HomePageFutter />
    </div>
  );
}
