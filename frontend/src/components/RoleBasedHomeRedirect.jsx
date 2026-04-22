import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleBasedHomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.profileCompleted) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "TECHNICIAN") {
    return <Navigate to="/technician/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export default RoleBasedHomeRedirect;