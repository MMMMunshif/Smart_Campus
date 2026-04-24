import { Navigate } from "react-router-dom";
import { getAuth, getDefaultPathByRole, isRoleSupported } from "../../utils/auth";

function ProtectedRoute({ allowedRoles, children }) {
  const auth = getAuth();

  if (!auth?.token) {
    return <Navigate to="/signin" replace />;
  }

  if (!isRoleSupported(auth.role)) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to={getDefaultPathByRole(auth.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
