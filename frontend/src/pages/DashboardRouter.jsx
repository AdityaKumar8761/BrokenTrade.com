import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { LearnerDashboard } from './LearnerDashboard';
import { InstructorDashboard } from './InstructorDashboard';
import { BrokerDashboard } from './BrokerDashboard';

export function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render correct dashboard based on user type
  switch (user.type) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Instructor':
      return <InstructorDashboard />;
    case 'Broker':
      return <BrokerDashboard />;
    case 'Learner':
    default:
      return <LearnerDashboard />;
  }
}
