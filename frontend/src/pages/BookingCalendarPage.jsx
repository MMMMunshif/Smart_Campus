import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getBookingsByUserEmail } from "../services/bookingService";

import {
  CalendarDays,
  Clock3,
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Hourglass,
  XCircle,
  Ban,
} from "lucide-react";

function getStatusBadge(status) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "PENDING":
      return `${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`;
    case "APPROVED":
      return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`;
    case "REJECTED":
      return `${base} bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400`;
    case "CANCELLED":
      return `${base} bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
    default:
      return `${base} bg-slate-100 text-slate-700`;
  }
}

function formatDateLabel(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-5 transition-colors duration-300">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className={`mt-3 text-3xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

function BookingCalendarPage() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);

  const loadBookings = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getBookingsByUserEmail(user.email);
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load booking calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const currentMonthDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const currentMonthLabel = currentMonthDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const filteredBookings = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    return bookings.filter((booking) => {
      const d = new Date(booking.bookingDate);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [bookings, currentMonthDate]);

  const groupedBookings = useMemo(() => {
    const grouped = {};

    filteredBookings.forEach((booking) => {
      if (!grouped[booking.bookingDate]) {
        grouped[booking.bookingDate] = [];
      }

      grouped[booking.bookingDate].push(booking);
    });

    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(a) - new Date(b)
    );
  }, [filteredBookings]);

  const stats = useMemo(() => {
    return {
      total: filteredBookings.length,
      approved: filteredBookings.filter((b) => b.status === "APPROVED").length,
      pending: filteredBookings.filter((b) => b.status === "PENDING").length,
      rejected: filteredBookings.filter((b) => b.status === "REJECTED").length,
      cancelled: filteredBookings.filter((b) => b.status === "CANCELLED").length,
    };
  }, [filteredBookings]);

  return (
    <AppLayout title="Booking Calendar">
      <div className="max-w-6xl space-y-6">

        {/* Hero */}
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">My Booking Calendar</h1>
          <p className="mt-3 text-blue-50 text-lg max-w-3xl">
            Manage your monthly reservations, track upcoming schedules,
            and monitor booking status in one professional view.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {currentMonthLabel}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Browse your bookings month by month
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setMonthOffset((prev) => prev - 1)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() => setMonthOffset(0)}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
              >
                Current Month
              </button>

              <button
                onClick={() => setMonthOffset((prev) => prev + 1)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
          <StatCard title="Total" value={stats.total} color="text-slate-900 dark:text-white" />
          <StatCard title="Approved" value={stats.approved} color="text-emerald-600" />
          <StatCard title="Pending" value={stats.pending} color="text-amber-600" />
          <StatCard title="Rejected" value={stats.rejected} color="text-rose-600" />
          <StatCard title="Cancelled" value={stats.cancelled} color="text-slate-500" />
        </div>

        {/* Legend */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-5">
          <div className="flex flex-wrap gap-3">
            <span className={getStatusBadge("APPROVED")}>Approved</span>
            <span className={getStatusBadge("PENDING")}>Pending</span>
            <span className={getStatusBadge("REJECTED")}>Rejected</span>
            <span className={getStatusBadge("CANCELLED")}>Cancelled</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-slate-500 dark:text-slate-400">
            Loading booking calendar...
          </div>
        ) : groupedBookings.length === 0 ? (
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center">
            <CalendarDays
              size={42}
              className="mx-auto text-slate-400 mb-4"
            />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              No Bookings Found
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              No bookings available for {currentMonthLabel}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {groupedBookings.map(([date, items]) => (
              <div
                key={date}
                className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6"
              >
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-2xl bg-sky-100 dark:bg-slate-800 p-3 text-sky-600 dark:text-sky-400">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                      {formatDateLabel(date)}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {items.length} booking{items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Booking Cards */}
                <div className="space-y-4">
                  {items.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-sky-50/40 dark:from-slate-900 dark:to-slate-800 p-5"
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                            <Building2 size={18} className="text-sky-500" />
                            <span className="font-bold">
                              {booking.resourceName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Clock3 size={16} className="text-sky-500" />
                            <span>
                              {booking.startTime?.slice(0, 5)} -{" "}
                              {booking.endTime?.slice(0, 5)}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Purpose: {booking.purpose}
                          </p>

                          {booking.remarks && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Remarks: {booking.remarks}
                            </p>
                          )}
                        </div>

                        <div>
                          <span className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </span>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}

export default BookingCalendarPage;