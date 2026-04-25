import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3, Clock3, FileDown, ShieldCheck } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { downloadAdminReport, getAdminAnalytics } from "../services/bookingService";

function StatCard({ title, value, accent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-3 text-4xl font-bold text-slate-900">{value}</h3>
      <div className={`mt-4 h-1.5 w-16 rounded-full ${accent}`} />
    </div>
  );
}

function HorizontalBarChart({ title, data, barColor, emptyText }) {
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((item) => item.value || 0), 1);
  }, [data]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>

      {!data || data.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyText}</p>
      ) : (
        <div className="mt-5 space-y-4">
          {data.map((item) => {
            const value = item.value || 0;
            const percentage = Math.max((value / maxValue) * 100, value > 0 ? 8 : 0);

            return (
              <div key={`${title}-${item.label}`}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className={`h-2.5 rounded-full ${barColor} transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    totalResources: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalTickets: 0,
    resolvedTickets: 0,
    mostBookedResources: [],
    bookingTrends: [],
    ticketStatusDistribution: [],
    peakBookingHours: [],
    usageInsights: [],
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAdminAnalytics();
        setAnalytics(data);
      } catch (error) {
        toast.error("Failed to load admin analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const handleDownload = async (type) => {
    try {
      setDownloading(type);
      await downloadAdminReport(type);
      toast.success(`${type === "bookings" ? "Bookings" : "Incidents"} report exported`);
    } catch {
      toast.error("Failed to export report");
    } finally {
      setDownloading("");
    }
  };

  const resolutionRate =
    analytics.totalTickets === 0
      ? 0
      : Math.round((analytics.resolvedTickets / analytics.totalTickets) * 100);

  return (
    <AppLayout title="Admin Dashboard" role="ADMIN">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Campus Analytics + Reports</h2>
          <p className="mt-1 text-slate-500">
            Monitor booking demand, track ticket resolution, and export operational reports.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleDownload("bookings")}
            disabled={downloading === "bookings"}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FileDown size={16} />
            {downloading === "bookings" ? "Exporting..." : "Export Bookings"}
          </button>
          <button
            onClick={() => handleDownload("incidents")}
            disabled={downloading === "incidents"}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FileDown size={16} />
            {downloading === "incidents" ? "Exporting..." : "Export Incidents"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard title="Total Resources" value={analytics.totalResources} accent="bg-indigo-500" />
        <StatCard title="Total Bookings" value={analytics.totalBookings} accent="bg-cyan-500" />
        <StatCard title="Pending Bookings" value={analytics.pendingBookings} accent="bg-amber-500" />
        <StatCard title="Total Tickets" value={analytics.totalTickets} accent="bg-rose-500" />
        <StatCard title="Resolved Tickets" value={analytics.resolvedTickets} accent="bg-emerald-500" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <HorizontalBarChart
          title="Most Booked Resources"
          data={analytics.mostBookedResources}
          barColor="bg-indigo-500"
          emptyText="Resource utilization data will appear once bookings are recorded."
        />

        <HorizontalBarChart
          title="Booking Trends (Last 14 Days)"
          data={analytics.bookingTrends}
          barColor="bg-cyan-500"
          emptyText="No booking trend data yet."
        />

        <HorizontalBarChart
          title="Ticket Status Distribution"
          data={analytics.ticketStatusDistribution}
          barColor="bg-rose-500"
          emptyText="No ticket activity yet."
        />

        <HorizontalBarChart
          title="Peak Booking Hours"
          data={analytics.peakBookingHours}
          barColor="bg-amber-500"
          emptyText="Peak-hour data will appear after more bookings are added."
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl xl:col-span-2">
          <div className="flex items-center gap-2 text-slate-800">
            <BarChart3 size={18} />
            <h3 className="text-lg font-bold">Usage Insights</h3>
          </div>
          {loading ? (
            <p className="mt-4 text-slate-500">Loading insights...</p>
          ) : analytics.usageInsights.length === 0 ? (
            <p className="mt-4 text-slate-500">No insight data available yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {analytics.usageInsights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                >
                  {insight}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck size={18} />
            <h3 className="text-lg font-bold">Ticket Resolution</h3>
          </div>
          <p className="mt-4 text-4xl font-bold text-slate-900">{resolutionRate}%</p>
          <p className="mt-1 text-sm text-slate-500">Resolved over total tickets</p>

          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock3 size={15} />
              Operational Snapshot
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Pending bookings: <span className="font-semibold text-slate-900">{analytics.pendingBookings}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Open tickets: <span className="font-semibold text-slate-900">{analytics.totalTickets - analytics.resolvedTickets}</span>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;