import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdminAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9f8] font-body text-sm text-[#667085]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
