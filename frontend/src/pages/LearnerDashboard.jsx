import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function LearnerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '140px auto 40px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Learner Dashboard</h1>
        <p style={{ marginTop: '16px', color: '#52525b' }}>
          Welcome, {user?.name}! Your personalized learning and paper trading space is being built.
        </p>
        <div style={{ marginTop: '32px', padding: '40px', textAlign: 'center', background: '#f4f4f5', borderRadius: '12px' }}>
          <span style={{ fontSize: '48px' }}>📚</span>
          <h2 style={{ marginTop: '16px', fontSize: '20px', fontWeight: '600' }}>Modules Coming Soon</h2>
          <p style={{ marginTop: '8px', color: '#71717a' }}>Check back later to see your courses and practice trades.</p>
        </div>
      </div>
    </>
  );
}
