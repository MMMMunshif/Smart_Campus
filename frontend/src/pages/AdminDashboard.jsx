import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getAdminDashboardStats } from "../services/bookingService";

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white shadow-xl p-6 border border-slate-200">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className={`mt-3 text-4xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    cancelledBookings: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error("Failed to load admin dashboard");
      }
    };

    loadStats();
  }, []);

  return (
    <AppLayout title="Admin Dashboard" role="ADMIN">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard title="Total Bookings" value={stats.totalBookings} color="text-slate-900" />
        <StatCard title="Pending" value={stats.pendingBookings} color="text-yellow-600" />
        <StatCard title="Approved" value={stats.approvedBookings} color="text-green-600" />
        <StatCard title="Rejected" value={stats.rejectedBookings} color="text-red-600" />
        <StatCard title="Cancelled" value={stats.cancelledBookings} color="text-slate-600" />
      </div>

      <div className="mt-8 rounded-3xl bg-white shadow-xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Overview</h2>
        <p className="text-slate-500">
          This dashboard summarizes all booking activity across the system.
        </p>
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;