import { Navigate, Outlet } from 'react-router-dom';
import { getStoredTokens } from '../lib/axios';
import { decodeJwt, getDefaultRouteForRole } from '../modules/auth';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

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
    return <UnauthorizedPage />;
  }

  return <Outlet />;
};

export const RoleHomeRedirect = () => {
  const tokens = getStoredTokens();

  if (!tokens?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const user = decodeJwt(tokens.accessToken);
  return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
};

export const PublicOnlyRoute = () => {
  const tokens = getStoredTokens();

  if (tokens?.accessToken) {
    const user = decodeJwt(tokens.accessToken);
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
};
