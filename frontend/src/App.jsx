import { Routes, Route, Navigate } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import ManageBookings from "./pages/ManageBookings";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/bookings/new" element={<BookingPage />} />
      <Route path="/bookings/my" element={<MyBookings />} />
      <Route path="/admin/bookings" element={<ManageBookings />} />
    </Routes>
  );
}

export default App;