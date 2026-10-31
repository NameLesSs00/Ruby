import { Navigate, Outlet } from 'react-router-dom';
import { getStoredTokens } from '../lib/axios';
import { decodeJwt } from '../modules/auth';

export const ProtectedRoute = () => {
  const tokens = getStoredTokens();

  if (!tokens?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const tokens = getStoredTokens();

  if (!tokens?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const user = decodeJwt(tokens.accessToken);
  const role = user?.role || 'SuperAdmin';

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const tokens = getStoredTokens();

  if (tokens?.accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};


