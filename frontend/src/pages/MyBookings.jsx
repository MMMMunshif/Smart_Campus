import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getBookingsByUserEmail } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMyBookings = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getBookingsByUserEmail(user.email);
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, [user]);

  const getStatusBadge = (status) => {
    const base = "rounded-full px-3 py-1 text-xs font-semibold inline-block";

    switch (status) {
      case "PENDING":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "APPROVED":
        return `${base} bg-green-100 text-green-700`;
      case "REJECTED":
        return `${base} bg-red-100 text-red-700`;
      case "CANCELLED":
        return `${base} bg-slate-200 text-slate-700`;
      default:
        return `${base} bg-slate-100 text-slate-700`;
    }
  };

  return (
    <AppLayout title="My Bookings" role="USER">
      <div className="rounded-3xl bg-white shadow-2xl p-8">
        <p className="text-slate-500 mb-6">
          View and track all your submitted booking requests.
        </p>

        {loading ? (
          <p className="text-slate-500">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-slate-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-4">Resource</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Attendees</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Remarks</th>
                  <th className="p-4">Admin Note</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="p-4">{booking.resourceName}</td>
                    <td className="p-4">{booking.bookingDate}</td>
                    <td className="p-4">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="p-4">{booking.purpose}</td>
                    <td className="p-4">{booking.expectedAttendees}</td>
                    <td className="p-4">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">{booking.remarks || "-"}</td>
                    <td className="p-4">{booking.adminNote || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default MyBookings;