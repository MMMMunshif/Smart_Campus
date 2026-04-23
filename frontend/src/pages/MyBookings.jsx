import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getBookingsByUserEmail, filterBookings } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import {
  CalendarCheck,
  Search,
  RefreshCcw,
  CalendarDays,
  Building2,
  Clock,
  Filter,
  FileX,
} from "lucide-react";

function MyBookings() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "",
    bookingDate: "",
    resourceName: "",
  });

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

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFilters = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const data = await filterBookings({
        userEmail: user.email,
        status: filters.status || undefined,
        bookingDate: filters.bookingDate || undefined,
        resourceName: filters.resourceName || undefined,
      });

      setBookings(data);
    } catch (error) {
      toast.error("Failed to filter bookings");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    const cleared = {
      status: "",
      bookingDate: "",
      resourceName: "",
    };

    setFilters(cleared);

    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getBookingsByUserEmail(user.email);
      setBookings(data);
    } catch (error) {
      toast.error("Failed to reset bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const base =
      "rounded-full px-3 py-1 text-xs font-semibold inline-flex items-center gap-1.5";

    switch (status) {
      case "PENDING":
        return `${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case "APPROVED":
        return `${base} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`;
      case "REJECTED":
        return `${base} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`;
      case "CANCELLED":
        return `${base} bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
      default:
        return `${base} bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
    }
  };

  return (
    <AppLayout title="My Bookings" role="USER">
      <div className="max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">My Bookings</h1>
          <p className="mt-3 text-blue-100 text-lg">
            View, track, and filter all your submitted booking requests.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-colors duration-300">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 text-sky-600 dark:text-sky-400">
              <Filter size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Filter Bookings
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Filter by status, date, and resource name together.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <input
              type="date"
              name="bookingDate"
              value={filters.bookingDate}
              onChange={handleFilterChange}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-white"
            />

            <input
              type="text"
              name="resourceName"
              value={filters.resourceName}
              onChange={handleFilterChange}
              placeholder="Search Resource"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-white"
            />

            <button
              type="button"
              onClick={applyFilters}
              className="rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition"
            >
              Apply Filters
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white px-5 py-3 font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition"
            >
              <RefreshCcw size={16} />
              Reset Filters
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-600 dark:text-emerald-400">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Booking History
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">
              Loading your bookings...
            </p>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400">
                <FileX size={24} />
              </div>
              <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                No bookings found
              </p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-4 text-slate-600 dark:text-slate-300">Resource</th>
                    <th className="p-4 text-slate-600 dark:text-slate-300">Date</th>
                    <th className="p-4 text-slate-600 dark:text-slate-300">Time</th>
                    <th className="p-4 text-slate-600 dark:text-slate-300">Purpose</th>
                    <th className="p-4 text-slate-600 dark:text-slate-300">Attendees</th>
                    <th className="p-4 text-slate-600 dark:text-slate-300">Status</th>
                    <th className="p-4 text-slate-600 dark:text-slate-300">Remarks</th>
                    <th className="p-4 text-slate-600 dark:text-slate-300">Admin Note</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-4 text-slate-800 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-sky-500" />
                          {booking.resourceName}
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-sky-500" />
                          {booking.bookingDate}
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-sky-500" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        {booking.purpose}
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        {booking.expectedAttendees}
                      </td>

                      <td className="p-4">
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        {booking.remarks || "-"}
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        {booking.adminNote || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default MyBookings;