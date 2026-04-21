import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import { getUserDashboardStats } from "../services/bookingService";

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-3xl bg-white shadow-xl p-6 border border-slate-200">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className={`mt-3 text-4xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

function UserDashboard() {
  const [email, setEmail] = useState("affan@gmail.com");
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    cancelledBookings: 0,
  });

  const loadStats = async () => {
    try {
      const data = await getUserDashboardStats(email);
      setStats(data);
    } catch (error) {
      toast.error("Failed to load user dashboard");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AppLayout title="User Dashboard" role="USER">
      <div className="rounded-3xl bg-white shadow-xl p-6 border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl border p-3"
            placeholder="Enter your email"
          />
          <button
            onClick={loadStats}
            className="rounded-xl bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-700 transition"
          >
            Load My Stats
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard title="My Total Bookings" value={stats.totalBookings} color="text-slate-900" />
        <StatCard title="Pending" value={stats.pendingBookings} color="text-yellow-600" />
        <StatCard title="Approved" value={stats.approvedBookings} color="text-green-600" />
        <StatCard title="Rejected" value={stats.rejectedBookings} color="text-red-600" />
        <StatCard title="Cancelled" value={stats.cancelledBookings} color="text-slate-600" />
      </div>
    </AppLayout>
  );
}

export default UserDashboard;