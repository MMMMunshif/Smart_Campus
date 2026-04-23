import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getUserDashboardStats } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  Ban,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
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

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;

      try {
        const data = await getUserDashboardStats(user.email);
        setStats(data);
      } catch {
        toast.error("Failed to load dashboard");
      }
    };

    load();
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
            Manage your campus bookings, notifications, and requests from one place.
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
                    You requested <strong>{user?.requestedRole}</strong> access. Your request is still pending admin approval, so you are currently using the normal user dashboard.
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
                  Your request for <strong>{user?.requestedRole}</strong> access was not approved. You can continue using the system with normal user access.
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
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Quick Overview
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Keep track of your reservations and account activity from one place.
            </p>

            <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>• View all your booking requests and their current status.</p>
              <p>• Check notifications for approvals, rejections, and updates.</p>
              <p>• Open your booking calendar to see upcoming reservations clearly.</p>
              <p>• Update your profile details and photo anytime.</p>
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