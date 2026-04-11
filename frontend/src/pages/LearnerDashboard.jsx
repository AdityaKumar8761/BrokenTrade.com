import './css-pages/LearnerDashboard.css';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function LearnerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Learner Dashboard</h1>
        <p className="dashboard-greeting">
          Welcome, {user?.name}! Your personalized learning and paper trading space is being built.
        </p>
        <div className="dashboard-content-box">
          <span className="dashboard-icon">📚</span>
          <h2 className="dashboard-subtitle">Modules Coming Soon</h2>
          <p className="dashboard-desc">Check back later to see your courses and practice trades.</p>
        </div>
      </div>
    </>
  );
}
