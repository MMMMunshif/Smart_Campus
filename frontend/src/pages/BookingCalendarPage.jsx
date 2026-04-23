import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getBookingsByUserEmail } from "../services/bookingService";
import { CalendarDays, Clock3, Building2, ChevronLeft, ChevronRight } from "lucide-react";

function getStatusBadge(status) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "PENDING":
      return `${base} bg-amber-100 text-amber-700`;
    case "APPROVED":
      return `${base} bg-emerald-100 text-emerald-700`;
    case "REJECTED":
      return `${base} bg-rose-100 text-rose-700`;
    case "CANCELLED":
      return `${base} bg-slate-200 text-slate-700`;
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
      const bookingDate = new Date(booking.bookingDate);
      return (
        bookingDate.getFullYear() === year &&
        bookingDate.getMonth() === month
      );
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

    return Object.entries(grouped).sort(([a], [b]) => new Date(a) - new Date(b));
  }, [filteredBookings]);

  return (
    <AppLayout title="Booking Calendar">
      <div className="max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold">My Booking Calendar</h1>
          <p className="mt-3 text-blue-50 text-lg leading-8 max-w-3xl">
            View your bookings in a calendar-style timeline and keep track of upcoming reservations.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{currentMonthLabel}</h2>
              <p className="mt-1 text-slate-500">
                Browse your bookings month by month.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMonthOffset((prev) => prev - 1)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() => setMonthOffset(0)}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Current Month
              </button>

              <button
                onClick={() => setMonthOffset((prev) => prev + 1)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8 text-slate-500">
            Loading booking calendar...
          </div>
        ) : groupedBookings.length === 0 ? (
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-8 text-slate-500">
            No bookings found for {currentMonthLabel}.
          </div>
        ) : (
          <div className="space-y-5">
            {groupedBookings.map(([date, items]) => (
              <div
                key={date}
                className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                    <CalendarDays size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {formatDateLabel(date)}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {items.length} booking{items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {items.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50/40 p-5"
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-800">
                            <Building2 size={18} className="text-sky-500" />
                            <span className="font-bold">{booking.resourceName}</span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Clock3 size={16} className="text-sky-500" />
                            <span>
                              {booking.startTime?.slice(0, 5)} - {booking.endTime?.slice(0, 5)}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600">
                            Purpose: {booking.purpose}
                          </p>

                          {booking.remarks && (
                            <p className="text-sm text-slate-500">
                              Remarks: {booking.remarks}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3">
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