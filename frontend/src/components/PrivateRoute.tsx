import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PrivateRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
}
