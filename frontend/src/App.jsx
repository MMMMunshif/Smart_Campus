import { Routes, Route, Navigate } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import ManageBookings from "./pages/ManageBookings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/bookings/new" />} />
      <Route path="/bookings/new" element={<BookingPage />} />
      <Route path="/admin/bookings" element={<ManageBookings />} />
    </Routes>
  );
}

export default App;