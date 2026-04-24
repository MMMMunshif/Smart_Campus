import { Routes, Route, Navigate } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import ManageBookings from "./pages/ManageBookings";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OAuth2SuccessPage from "./pages/OAuth2SuccessPage";
import NotificationsPage from "./pages/NotificationsPage";
import UserRoleManagementPage from "./pages/UserRoleManagementPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { getAuth, getDefaultPathByRole } from "./utils/auth";

function App() {
  const auth = getAuth();
  const homePath = auth?.role ? getDefaultPathByRole(auth.role) : "/signin";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homePath} replace />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/oauth2/success" element={<OAuth2SuccessPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/my"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UserRoleManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
