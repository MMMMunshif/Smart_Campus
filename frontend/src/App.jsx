import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import ManageBookings from "./pages/ManageBookings";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import RoleRequestsPage from "./pages/RoleRequestsPage";
import ManageResourcesPage from "./pages/ManageResourcesPage";
import ResourceCataloguePage from "./pages/ResourceCataloguePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import RoleBasedHomeRedirect from "./components/RoleBasedHomeRedirect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/complete-profile" element={<CompleteProfilePage />} />

      <Route
        path="/app"
        element={<RoleBasedHomeRedirect />}
      />

      <Route
        path="/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/bookings/new"
        element={
          <RoleProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <BookingPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/bookings/my"
        element={
          <RoleProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <MyBookings />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/resources"
        element={
          <RoleProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <ResourceCataloguePage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageBookings />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin/role-requests"
        element={
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <RoleRequestsPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin/resources"
        element={
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageResourcesPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/technician/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["TECHNICIAN"]}>
            <div className="p-8 text-slate-700 text-xl">Technician Dashboard Coming Soon</div>
          </RoleProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;