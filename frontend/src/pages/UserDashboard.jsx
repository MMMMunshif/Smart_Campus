import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import {
  getUserDashboardStats,
  getUpcomingBookings,
} from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  Ban,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  CalendarDays,
  Building2,
  BellRing,
} from "lucide-react";
import { Link } from "react-router-dom";

function Card({ title, value, color, icon: Icon, iconBg }) {
  return (
    <div className="rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl p-6 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className={`mt-3 text-4xl font-bold ${color}`}>{value}</h3>
        </div>

        <div className={`rounded-2xl p-3 ${iconBg}`}>
          <Icon size={22} className={color} />
        </div>
      </div>
    </div>
  );
}

function UserDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    cancelledBookings: 0,
  });

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.email) return;

      try {
        const data = await getUserDashboardStats(user.email);
        setStats(data);
      } catch {
        toast.error("Failed to load booking statistics");
      }
    };

    const loadUpcomingBookings = async () => {
      if (!user?.email) return;

      try {
        setUpcomingLoading(true);
        const data = await getUpcomingBookings(user.email);
        setUpcomingBookings(Array.isArray(data) ? data : []);
      } catch {
        setUpcomingBookings([]);
      } finally {
        setUpcomingLoading(false);
      }
    };

    loadStats();
    loadUpcomingBookings();
  }, [user]);

  const showPendingApprovalCard = useMemo(() => {
    return (
      user?.role === "USER" &&
      user?.approvalStatus === "PENDING" &&
      user?.requestedRole &&
      user?.requestedRole !== "USER"
    );
  }, [user]);

  const showRejectedRoleCard = useMemo(() => {
    return (
      user?.role === "USER" &&
      user?.approvalStatus === "REJECTED" &&
      user?.requestedRole &&
      user?.requestedRole !== "USER"
    );
  }, [user]);

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

  const reminderBanner = useMemo(() => {
    if (!upcomingBookings.length) return null;

    const nearest = upcomingBookings[0];
    const today = new Date();
    const bookingDate = new Date(nearest.bookingDate);

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const bookingOnly = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate()
    );

    const diffDays = Math.round(
      (bookingOnly - todayOnly) / (1000 * 60 * 60 * 24)
    );

    let message = `Your next booking is for ${nearest.resourceName} on ${nearest.bookingDate} at ${nearest.startTime?.slice(
      0,
      5
    )}.`;

    if (diffDays === 0) {
      message = `You have a booking today for ${nearest.resourceName} at ${nearest.startTime?.slice(
        0,
        5
      )}.`;
    } else if (diffDays === 1) {
      message = `You have a booking tomorrow for ${nearest.resourceName} at ${nearest.startTime?.slice(
        0,
        5
      )}.`;
    }

    if (nearest.status === "PENDING") {
      message += " It is still pending approval.";
    }

    return {
      message,
      status: nearest.status,
    };
  }, [upcomingBookings]);

  return (
    <AppLayout title="Dashboard" role="USER">
      <div className="space-y-6">
        <div className="mb-2 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold">
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p className="mt-3 text-blue-100 text-lg">
            Logged in as {user?.email}
          </p>

          <p className="mt-5 text-white/90">
            Manage your campus bookings, notifications, and requests from one
            place.
          </p>
        </div>

        {showPendingApprovalCard && (
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20 p-6 shadow-lg transition-colors duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-700 dark:text-amber-400">
                  <ShieldAlert size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                    Role Request Under Review
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-amber-700 dark:text-amber-400 max-w-3xl">
                    You requested <strong>{user?.requestedRole}</strong> access.
                    Your request is still pending admin approval, so you are
                    currently using the normal user dashboard.
                  </p>
                </div>
              </div>

              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                View Profile
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {showRejectedRoleCard && (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/20 p-6 shadow-lg transition-colors duration-300">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-rose-100 dark:bg-rose-900/30 p-3 text-rose-700 dark:text-rose-400">
                <ShieldAlert size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-rose-800 dark:text-rose-300">
                  Role Request Not Approved
                </h2>
                <p className="mt-2 text-sm leading-6 text-rose-700 dark:text-rose-400 max-w-3xl">
                  Your request for <strong>{user?.requestedRole}</strong> access
                  was not approved. You can continue using the system with normal
                  user access.
                </p>
              </div>
            </div>
          </div>
        )}

        {reminderBanner && (
          <div className="rounded-[2rem] border border-sky-200 bg-sky-50 dark:border-sky-900/40 dark:bg-sky-900/20 p-5 shadow-lg transition-colors duration-300">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 text-sky-700 dark:text-sky-400">
                <BellRing size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-sky-800 dark:text-sky-300">
                  Booking Reminder
                </h2>
                <p className="mt-1 text-sm leading-6 text-sky-700 dark:text-sky-400">
                  {reminderBanner.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          <Card
            title="Total"
            value={stats.totalBookings}
            color="text-slate-900 dark:text-white"
            icon={ClipboardList}
            iconBg="bg-slate-100 dark:bg-slate-800"
          />
          <Card
            title="Pending"
            value={stats.pendingBookings}
            color="text-yellow-600 dark:text-yellow-400"
            icon={Clock3}
            iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          />
          <Card
            title="Approved"
            value={stats.approvedBookings}
            color="text-green-600 dark:text-green-400"
            icon={CheckCircle2}
            iconBg="bg-green-100 dark:bg-green-900/30"
          />
          <Card
            title="Rejected"
            value={stats.rejectedBookings}
            color="text-red-600 dark:text-red-400"
            icon={XCircle}
            iconBg="bg-red-100 dark:bg-red-900/30"
          />
          <Card
            title="Cancelled"
            value={stats.cancelledBookings}
            color="text-slate-600 dark:text-slate-300"
            icon={Ban}
            iconBg="bg-slate-100 dark:bg-slate-800"
          />
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-3 text-sky-600 dark:text-sky-400">
                <CalendarDays size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Upcoming Bookings
                </h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Your next scheduled reservations
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {upcomingLoading ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center text-slate-500 dark:text-slate-400">
                  Loading upcoming bookings...
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center text-slate-500 dark:text-slate-400">
                  No upcoming bookings found.
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                          <Building2 size={16} className="text-sky-500" />
                          {booking.resourceName}
                        </div>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {booking.bookingDate} • {booking.startTime} - {booking.endTime}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {booking.purpose}
                        </p>
                      </div>

                      <div>
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-colors duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Account Summary
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Your current academic/work category and system access details.
            </p>

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                  User Type
                </p>
                <p className="mt-2 text-lg font-bold text-slate-800 dark:text-white">
                  {user?.userType || "Not Set"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Access Role
                </p>
                <p className="mt-2 text-lg font-bold text-slate-800 dark:text-white">
                  {user?.role || "USER"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                  Requested Role
                </p>
                <p className="mt-2 text-lg font-bold text-slate-800 dark:text-white">
                  {user?.requestedRole || "USER"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Approval Status
                </p>
                <p className="mt-2 text-lg font-bold text-slate-800 dark:text-white">
                  {user?.approvalStatus || "NONE"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default UserDashboard;