import './css-pages/MyDashboard.css';
import { Header } from '../components/Header';
import { useState } from 'react';

export function MyDashboard() {
  const [userData, _setUserData] = useState({
    name: 'John Trader',
    email: 'john@example.com',
    overallProgress: 65,
    totalVideosWatched: 24,
    totalVideos: 40,
    practiceRecords: [
      {
        id: 1,
        name: 'Stock Trading Basics',
        score: 85,
        date: '2024-03-28',
        status: 'Completed'
      },
      {
        id: 2,
        name: 'Options Strategy',
        score: 72,
        date: '2024-03-25',
        status: 'Completed'
      },
      {
        id: 3,
        name: 'Risk Management',
        score: 90,
        date: '2024-03-20',
        status: 'Completed'
      }
    ],
    bookmarks: [
      {
        id: 1,
        title: 'Understanding Moving Averages',
        module: 'Technical Analysis',
        savedDate: '2024-03-27'
      },
      {
        id: 2,
        title: 'Portfolio Diversification',
        module: 'Risk Management',
        savedDate: '2024-03-25'
      },
      {
        id: 3,
        title: 'Candlestick Patterns',
        module: 'Technical Analysis',
        savedDate: '2024-03-22'
      }
    ],
    recentTopics: [
      {
        id: 1,
        title: 'Fundamental Analysis',
        module: 'Stock Analysis',
        visitedDate: '2024-03-28',
        duration: '12 min'
      },
      {
        id: 2,
        title: 'Earnings Report Analysis',
        module: 'Stock Analysis',
        visitedDate: '2024-03-27',
        duration: '18 min'
      },
      {
        id: 3,
        title: 'Market Trends',
        module: 'Market Overview',
        visitedDate: '2024-03-26',
        duration: '15 min'
      },
      {
        id: 4,
        title: 'Trading Psychology',
        module: 'Trading Mindset',
        visitedDate: '2024-03-25',
        duration: '20 min'
      }
    ]
  });

  return (
    <>
      <Header />
      <div className="dashboard-container">
        {/* User Profile Section */}
        <div className="dashboard-profile">
          <div className="profile-header">
            <div className="profile-avatar">
              {userData.name.charAt(0)}
            </div>
            <div className="profile-info">
              <h1>{userData.name}</h1>
              <p>{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <section className="dashboard-section">
          <h2>Your Progress</h2>
          <div className="progress-overview">
            <div className="progress-card">
              <h3>Overall Progress</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${userData.overallProgress}%` }}></div>
              </div>
              <p>{userData.overallProgress}% Complete</p>
            </div>
            <div className="progress-card">
              <h3>Videos Watched</h3>
              <div className="stats-number">{userData.totalVideosWatched}</div>
              <p>of {userData.totalVideos} videos</p>
            </div>
            <div className="progress-card">
              <h3>Practice Tests</h3>
              <div className="stats-number">{userData.practiceRecords.length}</div>
              <p>Completed</p>
            </div>
          </div>
        </section>

        {/* Recent Topics Section */}
        <section className="dashboard-section">
          <h2>Recent Topics Visited</h2>
          <div className="recent-topics">
            {userData.recentTopics.map((topic) => (
              <div key={topic.id} className="topic-card">
                <div className="topic-content">
                  <h4>{topic.title}</h4>
                  <p className="topic-module">{topic.module}</p>
                  <div className="topic-meta">
                    <span className="topic-date">{topic.visitedDate}</span>
                    <span className="topic-duration">Duration: {topic.duration}</span>
                  </div>
                </div>
                <button className="continue-btn">Continue</button>
              </div>
            ))}
          </div>
        </section>

        {/* Bookmarks Section */}
        <section className="dashboard-section">
          <h2>Your Bookmarks</h2>
          <div className="bookmarks">
            {userData.bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bookmark-card">
                <div className="bookmark-icon">📌</div>
                <div className="bookmark-content">
                  <h4>{bookmark.title}</h4>
                  <p className="bookmark-module">{bookmark.module}</p>
                  <p className="bookmark-date">Saved on {bookmark.savedDate}</p>
                </div>
                <button className="view-btn">View</button>
              </div>
            ))}
          </div>
        </section>


      </div>
    </>
  );
}
