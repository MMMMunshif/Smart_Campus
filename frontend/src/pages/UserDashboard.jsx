import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getUserDashboardStats } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

function Card({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white shadow-xl p-6 border border-slate-200">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className={`mt-3 text-4xl font-bold ${color}`}>{value}</h3>
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

  return (
    <AppLayout title="Dashboard" role="USER">
      <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 p-8 text-white shadow-2xl">
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <Card title="Total" value={stats.totalBookings} color="text-slate-900" />
        <Card title="Pending" value={stats.pendingBookings} color="text-yellow-600" />
        <Card title="Approved" value={stats.approvedBookings} color="text-green-600" />
        <Card title="Rejected" value={stats.rejectedBookings} color="text-red-600" />
        <Card title="Cancelled" value={stats.cancelledBookings} color="text-slate-600" />
      </div>
    </AppLayout>
  );
}

export default UserDashboard;