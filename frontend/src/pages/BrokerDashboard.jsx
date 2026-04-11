import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function BrokerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '140px auto 40px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Broker Dashboard</h1>
        <p style={{ marginTop: '16px', color: '#52525b' }}>
          Welcome, Broker {user?.name}! Your performance tracking and client panel is being prepared.
        </p>
        <div style={{ marginTop: '32px', padding: '40px', textAlign: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
          <span style={{ fontSize: '48px' }}>💼</span>
          <h2 style={{ marginTop: '16px', fontSize: '20px', fontWeight: '600', color: '#166534' }}>Broker Portal Offline</h2>
          <p style={{ marginTop: '8px', color: '#15803d' }}>Client management tools will appear here when completed.</p>
        </div>
      </div>
    </>
  );
}
