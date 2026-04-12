import { Link } from 'react-router-dom';
import '../styles/dashboard-shell.css';
import './css-pages/LearnerDashboard.css';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function LearnerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="dash-page">
        <div className="dash-inner">
          <header className="dash-hero">
            <div className="dash-hero__top">
              <div>
                <p className="dash-eyebrow">Learner</p>
                <h1 className="dash-title">Your workspace</h1>
                <p className="dash-lede">
                  Hi <strong>{user?.name}</strong>. Jump back into courses, documentation, or paper trading from
                  here. More personalised modules will layer onto this view over time.
                </p>
              </div>
            </div>
            <nav className="dash-quick" aria-label="Shortcuts">
              <Link className="dash-quick__link" to="/courses">
                <span className="dash-quick__icon" aria-hidden="true">
                  ◆
                </span>
                <span>Browse courses</span>
              </Link>
              <Link className="dash-quick__link" to="/learn">
                <span className="dash-quick__icon" aria-hidden="true">
                  ≡
                </span>
                <span>Documentation</span>
              </Link>
              <Link className="dash-quick__link" to="/practice">
                <span className="dash-quick__icon" aria-hidden="true">
                  ∼
                </span>
                <span>Paper trading</span>
              </Link>
            </nav>
          </header>

          <section className="dash-panel learner-dash__panel">
            <div className="dash-spotlight">
              <div className="dash-spotlight__mark" aria-hidden="true">
                L
              </div>
              <h2>Learning path</h2>
              <p>
                Your enrolled courses and practice history will surface in this panel as the platform grows. For
                now, use the shortcuts above to stay in flow.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
