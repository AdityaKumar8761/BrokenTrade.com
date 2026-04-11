import './css-pages/BrokerDashboard.css';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function BrokerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="broker-container">
        <h1 className="broker-title">Broker Dashboard</h1>
        <p className="broker-greeting">
          Welcome, Broker {user?.name}! Your performance tracking and client panel is being prepared.
        </p>
        <div className="broker-content-box">
          <span className="broker-icon">💼</span>
          <h2 className="broker-subtitle">Broker Portal Offline</h2>
          <p className="broker-desc">Client management tools will appear here when completed.</p>
        </div>
      </div>
    </>
  );
}
