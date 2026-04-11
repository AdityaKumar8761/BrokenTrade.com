import './css-pages/InstructorDashboard.css';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function InstructorDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="instructor-container">
        <h1 className="instructor-title">Instructor Dashboard</h1>
        <p className="instructor-greeting">
          Welcome, {user?.name}! Your teaching tools and course management panel is under construction.
        </p>
        <div className="instructor-content-box">
          <span className="instructor-icon">👨‍🏫</span>
          <h2 className="instructor-subtitle">Course Creator Loading</h2>
          <p className="instructor-desc">Check back later to upload your trading materials and manage students.</p>
        </div>
      </div>
    </>
  );
}
