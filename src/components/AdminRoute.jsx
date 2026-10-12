import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import Loading from './Loading';
import Button from './Button';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading message="Checking administrator privileges..." fullHeight />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-xs">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">403 — Access Forbidden</h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-2">
          Administrator privileges are required to access this console.
        </p>
        <p className="text-xs text-slate-400 mb-6">
          Logged in as: <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.email}) [Role: {user?.role}]
        </p>
        <div className="flex gap-2 justify-center">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary" size="md">
              Go to Dashboard
            </Button>
          </Link>
          <Link to={ROUTES.HOME}>
            <Button variant="outline" size="md">
              Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
