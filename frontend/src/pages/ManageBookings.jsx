import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllBookings,
  getBookingsByStatus,
  searchBookingsByResource,
  searchBookingsByDate,
  approveBooking,
  rejectBooking,
  cancelBooking,
} from "../services/bookingService";
import AppLayout from "../components/layout/AppLayout";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      toast.success("Booking approved");
      loadBookings();
    } catch (error) {
      toast.error("Approve failed");
    }
  };

  const handleReject = async (id) => {
    const note = prompt("Enter rejection reason:");
    if (!note) return;

    try {
      await rejectBooking(id, note);
      toast.success("Booking rejected");
      loadBookings();
    } catch (error) {
      toast.error("Reject failed");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      loadBookings();
    } catch (error) {
      toast.error("Cancel failed");
    }
  };

  const handleStatusFilter = async (value) => {
    setStatusFilter(value);

    try {
      setLoading(true);
      if (!value) {
        await loadBookings();
        return;
      }
      const data = await getBookingsByStatus(value);
      setBookings(data);
    } catch (error) {
      toast.error("Failed to filter by status");
    } finally {
      setLoading(false);
    }
  };

  const handleResourceSearch = async () => {
    if (!resourceSearch.trim()) {
      loadBookings();
      return;
    }

    try {
      setLoading(true);
      const data = await searchBookingsByResource(resourceSearch);
      setBookings(data);
    } catch (error) {
      toast.error("Resource search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async (value) => {
    setDateFilter(value);

    if (!value) {
      loadBookings();
      return;
    }

    try {
      setLoading(true);
      const data = await searchBookingsByDate(value);
      setBookings(data);
    } catch (error) {
      toast.error("Date filter failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setStatusFilter("");
    setResourceSearch("");
    setDateFilter("");
    loadBookings();
  };

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
    <AppLayout title="Manage Bookings" role="ADMIN">
      <div className="rounded-3xl bg-white shadow-2xl p-8">
        <p className="text-slate-500 mb-6">
          Review, approve, reject, and monitor booking requests.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <input
            type="text"
            value={resourceSearch}
            onChange={(e) => setResourceSearch(e.target.value)}
            placeholder="Search by resource"
            className="rounded-xl border p-3"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="rounded-xl border p-3"
          />

          <div className="flex gap-2">
            <button
              onClick={handleResourceSearch}
              className="flex-1 rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-700 transition"
            >
              Search
            </button>
            <button
              onClick={handleResetFilters}
              className="flex-1 rounded-xl bg-slate-200 text-slate-800 py-3 font-semibold hover:bg-slate-300 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-slate-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Admin Note</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="p-4">{booking.userName}</td>
                    <td className="p-4">{booking.userEmail}</td>
                    <td className="p-4">{booking.resourceName}</td>
                    <td className="p-4">{booking.bookingDate}</td>
                    <td className="p-4">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="p-4">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">{booking.adminNote || "-"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="rounded-lg bg-green-600 px-3 py-2 text-white disabled:opacity-50"
                          disabled={booking.status !== "PENDING"}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                          disabled={booking.status !== "PENDING"}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="rounded-lg bg-slate-700 px-3 py-2 text-white disabled:opacity-50"
                          disabled={booking.status !== "APPROVED"}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
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

export default ManageBookings;