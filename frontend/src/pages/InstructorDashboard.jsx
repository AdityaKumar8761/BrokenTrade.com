import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function InstructorDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '140px auto 40px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Instructor Dashboard</h1>
        <p style={{ marginTop: '16px', color: '#52525b' }}>
          Welcome, {user?.name}! Your teaching tools and course management panel is under construction.
        </p>
        <div style={{ marginTop: '32px', padding: '40px', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <span style={{ fontSize: '48px' }}>👨‍🏫</span>
          <h2 style={{ marginTop: '16px', fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Course Creator Loading</h2>
          <p style={{ marginTop: '8px', color: '#64748b' }}>Check back later to upload your trading materials and manage students.</p>
        </div>
      </div>
    </>
  );
}
