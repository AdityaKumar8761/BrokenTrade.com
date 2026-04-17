import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css-pages/LearnerDashboard.css';
import { Header } from '../components/Header';
import { HomePageFutter } from '../components/HomePageFutter';
import { useAuth } from '../context/AuthContext';

export function LearnerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    async function fetchData() {
      try {
        const [profileRes, enrollRes, chatRes] = await Promise.all([
          fetch(`/User/${user.id}`),
          fetch(`/User/${user.id}/enrollments`),
          fetch(`/api/chat/inbox/${user.id}`)
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (enrollRes.ok) {
          const enrollData = await enrollRes.json();
          setEnrollments(enrollData);
        }

        if (chatRes.ok) {
          const chats = await chatRes.json();
          const brokerChat = chats.find(c => {
            const learnerId = c.learnerId?._id || c.learnerId;
            return learnerId && String(learnerId) === String(user.id);
          });
          if (brokerChat && brokerChat.brokerId) {
            setBroker(brokerChat.brokerId);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  return (
    <div className="yt-layout-wrapper">
      <Header />
      <main className="yt-main-content">
        
        {/* Top Pills Section (Like YouTube filters) */}
        <div className="yt-filters-bar">
          <Link to="/courses" className="yt-pill yt-pill--active">Browse Courses</Link>
          <Link to="/learn" className="yt-pill">Documentation</Link>
          <Link to="/practice" className="yt-pill">Paper Trading</Link>
          <div className="yt-pill yt-pill--coins">
            <span className="yt-coins-icon">🪙</span> 
            {profile?.coins !== undefined ? profile.coins.toLocaleString() : '---'}
          </div>
        </div>

        {/* Content Section */}
        <div className="yt-content-grid">
          
          <div className="yt-courses-section">
            <h2 className="yt-section-title">Your Enrolled Courses</h2>
            
            {loading ? (
              <div className="yt-loading-state">Loading your courses...</div>
            ) : enrollments.length > 0 ? (
              <div className="yt-video-grid">
                {enrollments.map((enrollment) => (
                  <Link 
                    to={`/courses/${enrollment.courseId?._id}`} 
                    key={enrollment._id} 
                    className="yt-video-card"
                  >
                    <div className="yt-video-thumbnail">
                      {enrollment.courseId?.thumbnail ? (
                        <img 
                          src={enrollment.courseId.thumbnail} 
                          alt={enrollment.courseId.title} 
                          className="yt-thumbnail-image" 
                        />
                      ) : (
                        <div className="yt-thumbnail-placeholder">Course</div>
                      )}
                      <div className="yt-video-duration">Enrolled</div>
                    </div>
                    <div className="yt-video-info">
                      <div className="yt-video-avatar">
                        {enrollment.courseId?.title?.charAt(0) || 'C'}
                      </div>
                      <div className="yt-video-details">
                        <h3 className="yt-video-title">{enrollment.courseId?.title || 'Unknown Course'}</h3>
                        <p className="yt-video-channel">BrokenTrade Education</p>
                        <p className="yt-video-meta">Started on {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="yt-empty-state">
                <p>You haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="yt-pill yt-pill--active">Explore Catalog</Link>
              </div>
            )}
          </div>

          <aside className="yt-sidebar">
            <h2 className="yt-section-title">My Broker</h2>
            {loading ? (
              <div className="yt-loading-state">Loading...</div>
            ) : broker ? (
              <div className="yt-broker-panel">
                <div className="yt-broker-header">
                  {broker.image ? (
                    <img src={broker.image} alt={broker.name} className="yt-broker-avatar" />
                  ) : (
                    <div className="yt-broker-avatar-fallback">{broker.name.charAt(0)}</div>
                  )}
                  <h3 className="yt-broker-name">{broker.name}</h3>
                </div>
                <p className="yt-broker-desc">Your dedicated trading broker. Reach out for assistance.</p>
                <Link to={`/chat/broker/${broker._id}`} className="yt-broker-action">
                  Message Broker
                </Link>
              </div>
            ) : (
              <div className="yt-empty-state yt-empty-state--small">
                <p>No broker assigned yet.</p>
                <Link to="/brokers" className="yt-pill">Find Broker</Link>
              </div>
            )}
          </aside>

        </div>
      </main>
      <HomePageFutter />
    </div>
  );
}
