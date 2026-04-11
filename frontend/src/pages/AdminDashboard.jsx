import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/User/all');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '140px auto 40px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Admin Dashboard</h1>
        <p style={{ color: '#52525b', marginBottom: '32px' }}>Welcome back, {user?.name}. Here is an overview of all registered users on BrokenTrade.</p>

        {loading ? (
          <div>Loading user data...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <table style={{ minWidth: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                  <th style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>PAN</th>
                  <th style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Phone</th>
                  <th style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Joined</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '14px' }}>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>{u.name}</td>
                    <td style={{ padding: '16px', color: '#4b5563' }}>{u.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        background: u.type === 'Admin' ? '#fef08a' : u.type === 'Instructor' ? '#bfdbfe' : u.type === 'Broker' ? '#bbf7d0' : '#f3f4f6', 
                        color: u.type === 'Admin' ? '#854d0e' : u.type === 'Instructor' ? '#1e40af' : u.type === 'Broker' ? '#166534' : '#374151',
                        padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {u.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#4b5563' }}>{u.pan}</td>
                    <td style={{ padding: '16px', color: '#4b5563' }}>{u.mobile}</td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
